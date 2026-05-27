import {useState} from 'react';

const Home = () => {

    const title = 'Welcome to the new blog';
    const likes = 50;
    const person = {name:'yuwen',age:'10'};
    const link = "https://www.google.com/";
    const handleClick = () => {
      console.log('hello '+name);
      setName("Gerry");
      setAge(age+100);
    };

    const [name, setName] = useState('Reece');
    const  [age, setAge] = useState(25);


    return (
        <div>
            <h1>{ title }</h1>
            <p> Liked {likes} times</p>
            <p> Auther:{name}, Age: {age}</p>
            <p> {Math.random()*100}</p>
            <a href={link}>Google Site</a>
            <button onClick={()=>{handleClick()}}>Click me</button>
        </div>
    );
}

export default Home;
