using DotNetEnv;
using MySql.Data.MySqlClient;
using PacketDotNet;
using SharpPcap;
using SharpPcap.LibPcap;
using System.Text;

namespace PacketFlowMonitor
{
    public class Program
    {
        // 임시 키워드
        private readonly static string[] _keywords = {"confidential", "information", "trade", "secret", "security"};
        private static string _employeeId;
        private static LibPcapLiveDevice _device;

        static void Main(string[] args)
        {
            Console.WriteLine(args[0]);
            _employeeId = args[0];
            //_employeeId = "12345678";
            if (_employeeId.Length < 1 || _employeeId == null) throw new Exception("Not Found Employee ID");
            InitializeDevice();
        }

        private static void InitializeDevice()
        {
            for (int i = 0; i < LibPcapLiveDeviceList.Instance.Count; i++)
            {
                if (LibPcapLiveDeviceList.Instance[i].ToString().Contains("Wi-Fi"))
                {
                    _device = LibPcapLiveDeviceList.Instance[i];
                    break;
                }
            }

            Console.WriteLine(_device.ToString());
            _device.Open();
            _device.OnPacketArrival += Device_OnPacketArrival;
            _device.StartCapture();

            AppDomain.CurrentDomain.ProcessExit += (sender, e) =>
            {
                if (_device == null || !_device.Started) return;
                _device.StopCapture();
                _device.Close();
                Console.WriteLine("[AgentMonitor] Program Exit");
            };
            Thread.Sleep(Timeout.Infinite);
        }
        private static void Device_OnPacketArrival(object s, PacketCapture e)
        {
            try
            {
                byte[]? payload = null;
                string sourceIp, destIp;
                int sourcePort = 0;
                int destPort = 0;
                string text;

                byte[] rawBytes = e.GetPacket().Data;
                LinkLayers linkLayerType = e.GetPacket().LinkLayerType;

                // 패킷 파싱
                Packet packet = Packet.ParsePacket(linkLayerType, rawBytes);

                EthernetPacket? ether = packet.Extract<EthernetPacket>();
                if (ether == null) return;

                IPPacket? ip = packet.Extract<IPPacket>();
                if (ip == null) return;
                sourceIp = ip.SourceAddress.ToString();
                destIp = ip.DestinationAddress.ToString();

                // TCP/UDP 분류
                switch (ip.Protocol)
                {
                    case ProtocolType.Udp:
                        {
                            UdpPacket udp = packet.Extract<UdpPacket>();
                            if (udp == null) return;
                            sourcePort = udp.SourcePort;
                            destPort = udp.DestinationPort;
                            payload = udp.PayloadData;
                            break;
                        }
                    case ProtocolType.Tcp:
                        {
                            TcpPacket tcp = packet.Extract<TcpPacket>();
                            sourcePort = tcp.SourcePort;
                            destPort = tcp.DestinationPort;
                            payload = tcp.PayloadData;
                            break;
                        }
                }

                if (sourcePort == 3306 || destPort == 3306) return;

                // payload 추출
                if (payload == null || payload.Length <= 0) return;
                text = Encoding.ASCII.GetString(payload);

                // 키워드 탐지
                foreach (string keyword in _keywords)
                {
                    if (text.IndexOf(keyword, StringComparison.OrdinalIgnoreCase) < 0) continue;

                    Console.WriteLine("======================");
                    Console.WriteLine($"Detected Keyword: {keyword}");
                    Console.WriteLine($"payload: {text}");

                    string now = DateTime.Now.ToString("yyyy-MM-dd");

                    SuspicionLog detectedLog = new SuspicionLog
                    {
                        Msg = $"Detected Keyword {keyword}",
                        keyword = keyword,
                        EmpId = _employeeId,
                        SourceIp = sourceIp,
                        DestIp = destIp,
                        SourcePort = sourcePort,
                        DestPort = destPort,
                        DetectedAt = now,
                    };


                    insertSuspicionLog(detectedLog);

                    break;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing packet: {ex.Message}");
            }
        }
        private static void insertSuspicionLog(SuspicionLog log)
        {
            try
            {
                Env.Load();

                string? host = Environment.GetEnvironmentVariable("DB_HOST");
                if (host == null) return;
                string? port = Environment.GetEnvironmentVariable("DB_PORT");
                if (port == null) return;
                string? uid = Environment.GetEnvironmentVariable("DB_UID");
                if (uid == null) return;
                string? pwd = Environment.GetEnvironmentVariable("DB_PWD");
                if (pwd == null) return;
                string? name = Environment.GetEnvironmentVariable("DB_NAME");
                if (name == null) return;

                string dbConnection = $"Server={host};Port={port};Database={name};Uid={uid};Pwd={pwd}";

                using (MySqlConnection connection = new MySqlConnection(dbConnection))
                {
                    connection.Open();

                    string query = "insert into suspicion_logs(msg, emp_id, `type`, source_ip, dest_ip, source_port, dest_port, keyword, detected_at) ";
                    query += $"values ('{log.Msg}', {_employeeId}, 'outflow', '{log.SourceIp}', '{log.DestIp}', {log.SourcePort}, {log.DestPort}, '{log.keyword}', '{log.DetectedAt}');";

                    MySqlCommand cmd = new MySqlCommand(query, connection);

                    if (cmd.ExecuteNonQuery() == 1) Console.WriteLine("Success Insert");
                    else Console.WriteLine("Failed Insert");

                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

    }
}