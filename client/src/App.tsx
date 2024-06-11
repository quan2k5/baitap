import React, { useEffect, useState } from 'react'
// import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import './App.css'
import axios from 'axios';
interface Work{
  id:number,
  name:string,
  status:boolean,
}
export default function App() {
  const [works,setWorks]=useState<Work[]>([]);
  const [checkModal,setCheckModal]=useState<boolean>(false);
  const [typeSubmit,setTypeSubmit]=useState<string>("Thêm công việc");
  const [checked,setChecked]=useState<boolean>(true);
  const [work,setWork]=useState<Work>({
    id:0,
    name:'',
    status:false,
  })
  const getData=()=>{
    axios.get('http://localhost:3000/works?_sort=id&_order=desc')
    .then((res:any)=>{
      // setCheckModal(true);
      // setTimeout(function(){
      //   setCheckModal(false);
      //   setWorks(res.data);
      // },1000);
      setWorks(res.data);
    })
    .catch((err)=>console.log(err))
  }
  useEffect(()=>{
    getData();
  },[])
  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    if(e.target.value===''){
      setChecked(false);
    }else{
      setChecked(true);
    }
    const{name}=e.target;
    const {value}=e.target;
    setWork({...work,[name]:value})
  }
  const resetInput=()=>{
    setWork({
      id:0,
      name:'',
      status:false,
    })
  }
  const createWork=()=>{
    if(work.name===''){
      setChecked(false);
      return;
    }else{
      setChecked(true);
    }
    if(typeSubmit==='Thêm công việc'){
      axios.post('http://localhost:3000/works',work)
      .then(()=>{
      getData();
      resetInput();
      })
      .catch(err=>console.log(err))
    }else{
      axios.patch(`http://localhost:3000/works/${work.id}`,work)
      .then(()=>{
         getData();
          setTypeSubmit('Thêm công việc');
          resetInput();
      })
      .catch(err=>console.log(err))
    }
  }
  const statusWork=(b:boolean,id:number)=>{
    axios.patch(`http://localhost:3000/works/${id}`,{status:b})
    .then(()=>{
      axios.get('http://localhost:3000/works')
    .then((res:any)=>{
        setWorks(res.data);
    })
    .catch((err)=>console.log(err))
    })
    .catch((error)=>{
      console.log(error);
    })
  }
  const removeWork=(id:number)=>{
    console.log(id);
    if(confirm('Bạn có muốn xóa công việc này ko?')){
      console.log("run");
      
      axios.delete(`http://localhost:3000/works/${id}`)
      .then(()=>getData())
      .catch(err=>console.log(err))
    }
  } 
  const handleUpdate=(id:number)=>{
    setTypeSubmit('Cập nhật công việc');
     axios.get(`http://localhost:3000/works/${id}`)
    .then((res:any)=>setWork(res.data))
    .catch(err=>console.log(err))
  }
  const filterWorks=(str:string)=>{
        axios.get(`http://localhost:3000/works?status=${str}&_sort=id&_order=desc`)
        .then(res=>setWorks(res.data))
        .catch(err=>console.log(err))
  }
  return (
    <div className='total-container'>
      {checkModal?<div className='modal'>
      </div>:<></>}
      <header>
        <h4>Quản lý công việc</h4>
      </header>
      <div className='input-box'>
        <input type="text" name='name' value={work.name} onChange={handleChange} placeholder='Nhập tên công việc của bạn'  />
        {!checked?<span style={{color:'red'}}>Tên công việc đang trống</span>:<></>}
        <button onClick={createWork}>{typeSubmit}</button>
      </div>
      <div className='status-box'>
        <button onClick={getData}>All</button>
        <button onClick={()=>{filterWorks('true')}}>Complete</button>
        <button onClick={()=>{filterWorks('false')}}>No complete</button>
      </div>
      <div className='workList'>
        {works.map(function(e){
          return <div className='workItem'>
            <div>
            <input type="checkbox" onChange={(b)=>{statusWork(b.target.checked,e.id)}} checked={e.status} />
            {e.status?<span style={{textDecoration: 'line-through'}}>{e.name}</span>:
            <span>{e.name}</span>}
            </div>
            <div>
            <i className='bx bxs-edit-alt' onClick={()=>handleUpdate((Number(e.id)))}></i>
            <i className='bx bxs-trash-alt' onClick={()=>{removeWork(Number(e.id))}}></i>
            </div>
          </div>
        })}

      </div>
    </div>
  )
}
