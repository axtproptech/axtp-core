const Kpis = () => {
  return (
    <div className="w-full p-4 bg-gray-500 mx-auto border-gray-100/10 border-y-2 bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10 mb-12 overflow-hidden">
      <div className="w-full max-w-5xl mx-auto flex xs:flex-col  md:flex-row xs:gap-4 md:gap-0 justify-center items-center flex-wrap">
        <div className="flex flex-1 flex-col justify-center text-center py-2 px-4 gap-1">
          <p className="text-white text-6xl font-bold ">900K</p>
          <p className="text-white text-xl opacity-80">Gross Market Value</p>
        </div>

        <div className="flex flex-1 flex-col justify-center text-center py-2 px-4 gap-1 border-gray-100/10 xs:border-0 md:border-l-2">
          <p className="text-white text-6xl font-bold ">10K</p>
          <p className="text-white text-xl opacity-80">Total Shareholders</p>
        </div>

        <div className="flex flex-1 flex-col justify-center text-center py-2 px-4 gap-1 border-gray-100/10 xs:border-0 md:border-l-2">
          <p className="text-white text-6xl font-bold ">46.5K</p>
          <p className="text-white text-xl opacity-80">Total Paid Dividends</p>
        </div>
      </div>
    </div>
  );
};

export default Kpis;
