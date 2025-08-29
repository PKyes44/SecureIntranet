import Button from "../../../components/button/button"
import InputGroup from "../../../components/input/inputGroup"

function SignInPage() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form className="flex-col flex justify-center items-center w-[450px] h-96 border border-[#8C8C8C]">
        <h1 className="font-bold text-white opacity-90 text-3xl mb-0.5">Tribosss Admin</h1>
        <span className="text-white opacity-70 font-light text-xs mb-10">Triboss Admin에 로그인하여 사원들을 관리하세요!</span>
        <div className="mb-5 flex gap-2 flex-col">
          <InputGroup placeholder="사번을 입력하세요"></InputGroup>
          <InputGroup placeholder="비밀번호를 입력하세요"></InputGroup>
        </div>
        <Button className="self-center">가입 요청하기</Button>
      </form>
    </div>
  )
}

export default SignInPage
