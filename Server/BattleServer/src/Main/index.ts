// 서버 초기화 작업
const initServer = async () => {
  try {
    //await testAllConnections(pools);
    // 다음 작업
  } catch (error: any) {
    console.error(error.message);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

export default initServer;
