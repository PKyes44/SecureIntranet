# 🛡️ Tribosss – 사내 보안 인트라넷

## 📌 프로젝트 개요
**Tribosss**는 Windows 기반 사내 인트라넷 프로그램으로,  
기업 내부의 **보안 강화를 위한 패킷 감시, 도메인 차단, 이중 인증(TOTP), 관리자 정책 제어 기능**을 통합적으로 제공하는 솔루션입니다.  

- **프로젝트 기간**: 2025.06-2025.8 (8주)   
- **프로젝트 목표**  
  - 기업 내부에서 발생하는 네트워크 보안 위협에 대한 **실시간 탐지 및 제어**  
  - **사원 관리 + 협업 도구(게시판, 채팅)** 제공  
  - 관리자(Admin)와 직원(Client)의 **역할 분리 및 정책 기반 보안 통제** 구현  

---

## 👥 팀원 소개

| 이름 | 담당 기능 |
|------|-----------|
| **양은석** (팀장) | - 회원가입 및 로그인 암호화<br>- 관리자 기능(정책 제어, 사원 관리, 로그 관리)<br>- 백그라운드 보안 모듈(패킷 감시, 도메인 차단)<br>- 사원 간 채팅 기능 |
| **임태현** | - 게시판 CRUD 구현<br>- 댓글 기능 개발<br>- 게시판 Pagination |
| **김세헌** | - 회원가입 및 로그인 로직 구현<br>- TOTP 기반 이중 인증(이메일 전송)<br> |

---

## ⚙️ 기술 스택

| 구분 | 사용 기술 |
|------|-----------|
| 언어 | **C#** |
| 프레임워크 | **.NET Framework**, **Windows Presentation Foundation (WPF)** |
| 라이브러리 | dotenv, **SharpPcap**, RabbitMQ, System.Net.Mail |
| 데이터베이스 | **MariaDB** |
| 서버/클라우드 | AWS EC2 |
| 협업 도구 | GitHub, Notion, Figma, KakaoTalk |
| 기타 도구 | Git, Putty |

---

## 🧭 기술적 의사결정

1. **데이터베이스: MariaDB**
   - **선택 이유**:  
     - MySQL과 호환성이 높으면서도 **오픈소스 + 가벼운 운영**이 가능  
     - MSSQL은 Windows 환경에 최적화되어 있었지만, **비용 문제와 라이선스 제약** 때문에 제외  
     - MariaDB는 커뮤니티 지원과 안정성이 뛰어나 중소 규모 인트라넷 DB에 적합하다고 판단  

2. **네트워크 통신**
   - **RabbitMQ (정책 제어)**  
     - **선택 이유**: 클라이언트에 정책(모니터링 ON/OFF, 사이트 차단 등)을 전달할 때, 메시지 재전송·큐 관리 기능이 필요했음  
     - RabbitMQ는 메시지 신뢰성·큐잉·라우팅에 강점이 있어 정책 전달에 적절
   - **WebSocket (채팅 기능)**  
     - **선택 이유**: 채팅은 실시간 양방향 통신이 핵심, RabbitMQ는 브로커 거치며 지연이 발생할 수 있음  
     - WebSocket은 서버와 클라이언트 간 **지속적인 연결**을 유지하면서 빠른 메시지 송수신 보장  

3. **패킷 캡처 라이브러리: SharpPcap**
   - **선택 이유**:  
     - WinPcap은 개발이 중단되었고, Npcap은 성능은 뛰어나지만 **C/C++ 바인딩 필요**로 팀 역량 대비 부담이 있었음  
     - 따라서 SharpPcap을 활용해 **빠른 개발 속도 + 안정성** 확보  

4. **이메일 기반 2차 인증 (TOTP)**
   - **선택 이유**:  
     - SMS 인증은 **비용 문제**로 인해 부적절하다고 판단  
     - 따라서 C#의 `System.Net.Mail`을 활용한 **이메일 TOTP 구현**으로 결정  

---

## 🔑 주요 기능

### 클라이언트 기능
- 회원가입 (사번 기반) 및 로그인 (ID/PW + TOTP 2차 인증)  
- 게시판 (공지 / 자유 게시판, CRUD 지원)  
- 댓글
- 사원 간 채팅 (1:1, 그룹)

### 클라이언트 백그라운드 기능
- **패킷 감시 모듈** 자동 실행 (클라이언트 로그인 시 시작)  
- 키워드/트래픽 탐지 후 관리자 로그 전송  
- 의심 로그 횟수 카운팅 및 실시간 표시  

### 관리자(Admin) 기능
- 정책 제어  
  - 패킷 모니터링 ON/OFF  
  - 유해 사이트 차단 (도메인 블랙리스트) ON/OFF
- 사원 관리 (가입 요청 승인/거절, 계정 관리)  
- 로그 조회 (기밀 유출 의심 로그)  
- 대시보드 형태의 보안 현황 시각화

---

## 📂 프로젝트 구조 (예시)

```bash
Tribosss/
 ┣ user_client/     # 직원 클라이언트 WPF 프로그램
 ┣ admin_client/    # 관리자 클라이언트 WPF 프로그램
 ┣ chat_server/     # 채팅 서버 (TCP 비동기 통신)
 ┗ README.md
```

---

## ERD
![ERD](https://file.notion.so/f/f/6b27fb8e-5ab0-4477-ac9d-05091a16120c/a1658fee-22a6-477a-9f60-dff16d76f934/image.png?table=block&id=245b6e92-e209-8084-99d8-f19ed2c70bc4&spaceId=6b27fb8e-5ab0-4477-ac9d-05091a16120c&expirationTimestamp=1756512000000&signature=rpj8dVNk1Y7ckOuJshh6Z74P7k2hvb4BvxoxUYqSxv0&downloadName=image.png)

## 시스템 구조도
![구조도](https://file.notion.so/f/f/6b27fb8e-5ab0-4477-ac9d-05091a16120c/668a3c15-ce44-42c7-ac53-39ffde6f6fa5/image.png?table=block&id=23ab6e92-e209-80ee-8714-cd60382f22fa&spaceId=6b27fb8e-5ab0-4477-ac9d-05091a16120c&expirationTimestamp=1756512000000&signature=2vmAv09xyyp4PabtW3Cu7_wlFfSbFa5wmtBm3ft5frI&downloadName=image.png)

--- 

## 주요 링크
[Figma 디자인 시안](https://www.figma.com/design/CPR6eyyzLdEt0ZqVM7A8G2/intranet?node-id=0-1&t=g8sXYUoyNzOerK21-1)
[팀 깃허브](https://github.com/Tribosss)

