const Loader = ({heightInVp}: {heightInVp: number}) => (
  <div className={`flex bg-[#0F0F0F] items-center justify-center h-[${heightInVp}vh]`}>
    <div className="animate-spin rounded-full text-white h-12 w-12 border-t-2 border-b-2 border-white"></div>
  </div>
);

export default Loader