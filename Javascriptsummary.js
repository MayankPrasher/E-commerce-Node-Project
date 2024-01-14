// var name = "Mayank";
// // console.log(name);
// var age = 22;
// var hasHobbies = true;

// function User(username ,  userage , userHashobby){

//     return('Name is '+username+
//     ', age is '+userage+
//     ' and the user has hobbies: '+userHashobby); 
// }

// Using let and const
// const name = "Mayank";
// // console.log(name);
// let age = 22;
// const hasHobbies = true;

// name = "Prsher";  
// gets an error here because name is defined earlier as const 

// function User(username ,  userage , userHashobby){

//     return('Name is '+username+
//     ', age is '+userage+
//     ' and the user has hobbies: '+userHashobby); 
// }
// ARROW FUNCTIONS////////
// const User = function(username ,  userage , userHashobby){
//     return('Name is '+username+
//     ', age is '+userage+
//     ' and the user has hobbies: '+userHashobby);
// }
// const User =(username ,  userage , userHashobby)=>{
//     return('Name is '+username+
//     ', age is '+userage+
//     ' and the user has hobbies: '+userHashobby);
// }
// console.log(User(name,age,hasHobbies));
// const add = (a,b)=>{
//     return a+b;
// }
// const add = (a,b)=>a+b;
// const addOne =(g)=>g+1;
// const addRandom =()=>1+2;
// console.log(addRandom());
// console.log(addOne(6));
// console.log(add(6,3));

// OBJECTS////

// const user ={
//     name : 'Mayank',
//     age : 22
// }
//object,function ,this
// const user ={
//     name : 'Mayank',
//     age : 22,
//     greet : ()=>{console.log("Hi I'm "+this.name)}
// }
// console.log(user);
// output:{ name: 'Mayank', age: 22, greet: [Function: greet] }
// const user ={
//     name : 'Mayank',
//     age : 22,
//     greet : ()=>{console.log("Hi I'm "+this.name)}
// }
// user.greet(); output:Hi I'm undefined
// console.log(user.greet);
// output:[Function: greet]
// { name: 'Mayank', age: 22, greet: [Function: greet] }
// const user ={
//         name : 'Mayank',
//         age : 22,
//         greet(){console.log("Hi I'm "+this.name)}
//     }
// user.greet();
// output:Hi I'm Mayank
//AARAYS and it's functions////
// const hobbies = ['cricket','singing','guitar'];
// // for(let hobby of hobbies){
// //     console.log(hobby);
// // }
// console.log(hobbies.map(hobby=>'Hobby: '+hobby));
// console.log(hobbies);
// hobbies.push('progrmming'); here we had talked about primitive and reference data types
// console.log(hobbies);
// SPREAD AND REST OPERATOR///

// const hobbies = ['cricket','singing','guitar'];
// const copiedHobbies = [hobbies]; gives array under array
// const copiedHobbies = [...hobbies];
// console.log(copiedHobbies);
// we can do same with objects
// const user ={
//         name : 'Mayank',
//         age : 22,
//         greet(){console.log("Hi I'm "+this.name)}
//     }
// const copiedUser = {...user};
// console.log(copiedUser);
// output:[ 'cricket', 'singing', 'guitar' ]
// { name: 'Mayank', age: 22, greet: [Function: greet] }
// now let's talk about rest OPERATOR it has same syntax like spread but has differently use
// const toArray = (args1,args2,args3)=>{
//     return [args1,args2,args3];
// }
// console.log(toArray(1, 2, 3));
// what if we now want a new argument in this function? rest oprator done this for us by providing this flexibility we now have variable amount of arguments
// const toArray = (...args)=>{
//     return args;
// }
// console.log(toArray(1, 2, 3));
///////DESTRUCTURING//////
//Object destructing
// const user ={
//         name : 'Mayank',
//         age : 22,
//         greet(){console.log("Hi I'm "+this.name)}
//     }
// const printName = (userData)=>{
//       console.log(userData.name);
// }
// printName(user);
// const printName = ({name})=>{
//     console.log(name);
// }
// printName(user);
// const {name , age} = user;
// console.log(name,age);

//Array destructing
// const hobbies = ['cricket','singing','guitar'];
// const [hobby1,hobby2]= hobbies;
// console.log(hobby1,hobby2);
//ASYNC AND PROMISES//
// const fetchData = ()=>{
//     const promise = new Promise((resolve,reject)=>{
//         setTimeout(()=>{
//         resolve('Done!');
//         },1500)
//     });
//     return promise;
// };
// setTimeout(
//     ()=>{
//     console.log('Timer is done');
//    fetchData().then(text=>{
//     console.log(text);
//     return fetchData();
//    })
//    .then(text2 =>{
//     console.log(text2);
//    });
//     },2000
// );
// console.log("hello");
// console.log("hi");



