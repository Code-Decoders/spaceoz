import React from 'react';
import './Home.css'
const Home = () => {

  return (
    <>
    <div className="user">
      <div className="pic">
        <img src={require("./cat-1.jpg")} alt="" className="pic-pic" />
      </div>
    <div className="sec"> 
        <h2>Oliver</h2>
      <div className="friend">
        <img src={require("./cat-1.jpg")} alt="" className="dog" />
        <p className="para">2 mutual friends</p>
      </div>
      <button className="btn">Add Friend</button>
    </div>
    </div>
    <div className="user">
      <div className="pic">
        <img src={require("./cat-1.jpg")} alt="" className="pic-pic" />
      </div>
      <div className="sec"> 
        <h2>Oliver</h2>
      <div className="friend">
        <img src={require("./cat-1.jpg")} alt="" className="dog" />
        <p className="para">2 mutual friends</p>
      </div>
      <button className="btn">Add Friend</button>
    </div>
    </div>
    <div className="user">
      <div className="pic">
        <img src={require("./cat-1.jpg")} alt="" className="pic-pic" />
      </div>
      <div className="sec"> 
        <h2>Oliver</h2>
      <div className="friend">
        <img src={require("./cat-1.jpg")} alt="" className="dog" />
        <p className="para">2 mutual friends</p>
      </div>
      <button className="btn">Add Friend</button>
      </div>
    </div>
    </>
  )
}

export default Home;
