// import MintNFT from "./components/MintNFT";
import MintNFT from "./components/MintNFT";
import NavBar from "./components/navbar";

function App() {

  const teamAlpha = [
    {id: 1, imgUrl: "./assets/peter-removebg-preview.png", title: "Firstname Lastname", discription: "Fullstack"},
    {id: 2, imgUrl: "./assets/peter-removebg-preview.png", title: "Firstname Lastname", discription: "Fullstack"},
    {id: 3, imgUrl: "./assets/peter-removebg-preview.png", title: "Firstname Lastname", discription: "Fullstack"},
    {id: 4, imgUrl: "./assets/peter-removebg-preview.png", title: "Firstname Lastname", discription: "Fullstack"}
  ];
  return (
    <>
      <section className="hero-bg">
        <NavBar />
        <div className="w-[80%] mx-auto pt-20 flex justify-between pb-10">
          <div className="flex justify-center items-center">
            <div className="max-w-sm">
              <h1 className="text-6xl font-semibold pb-1">Web3 Warri Hacker House.</h1>
              <p className="text-lg pb-1 font-medium">Turn your digital creations into one-of-a-kind NFTs</p>
              <p className="text-sm font-medium">Mint an NFT.....</p>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="transition ease-in-out delay-150 duration-300 w-[250px] h-[400px] hover:scale-125">
              <img className="w-full h-full" src="./assets/ikagi.jpg" alt="" />
            </div>
            <div className="transition ease-in-out delay-150 duration-300 w-[250px] h-[500px] hover:scale-125">
              <img className="w-full h-full object-cover" src="./assets/ikagiHand.jpg" alt="" />
            </div>
            <div className="transition ease-in-out delay-150 duration-300 w-[250px] h-[400px] hover:scale-125">
              <img className="w-full h-full object-cover" src="./assets/paul-mary.jpg" alt="" />
            </div>
          </div>
        </div>
      </section>


      <section className="gradient-bg">
        <div className="w-[80%] mx-auto">
          <h1 className="text-center text-4xl font-semibold pt-3 text-white">Meet Team Alpha</h1>
          <p className="text-center text-lg font-medium pt-1 pb-4 text-white">Passionate individuals committed to innovation and excellence.</p>
          <div className="flex justify-between mx-auto">
            {teamAlpha.map((index) => 
            <div key={index.id} className="w-[300px] flex flex-col justify-center items-center transition ease-in-out delay-150 duration-300 hover:scale-110">
            <div className="h-[270px] w-[270px] bg-white rounded-full object-cover shadow-lg mt-14"> 
            <img className="w-full h-full object-center rounded-full" src={index.imgUrl} alt="" />
            </div>
            <div className="bg-blue-500 text-center mt-2">
              <h2>{index.title}</h2>
              <p>{index.discription}</p>
            </div>
          </div>)}
          </div>
        </div>

        <div>
        <MintNFT/>
      </div>
      </section>
    </>
  );
}

export default App;
