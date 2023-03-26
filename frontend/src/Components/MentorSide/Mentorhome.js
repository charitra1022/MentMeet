import React from 'react'
import { useState } from 'react'
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import './Mentorhome.css'
export default function Menteehome() {
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    return (
        <>
            <Navbar className="navcontainer">
                <Container >
                    <Navbar.Brand href="#home"><h2>MentMeet</h2></Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar className="justify-content-end">
                        <Navbar.Text>
                            <button className="dashboard-btn">Profile</button>
                        </Navbar.Text>
                    </Navbar>
                </Container>
            </Navbar>
            <div className="main container fluid">
                <div className=" flex-container">
                    <div className="mx-3 my-2 card">
                        <a href='#' className="card-head">
                            <h5 className="card-header">Mentee1</h5>
                        </a>
                        <div className="card-body">
                            <div className="row">
                                <div className="col">
                                    <button className="collapse-btn done" onClick={() => setOpen1(!open1)} >Task#1 </button>
                                    <Collapse in={open1}>
                                        <div id="collapse-text" className="text-center collapse-text">
                                            <div className="task-tab done">
                                                Study inheritance in Java
                                            </div>
                                            <div className="task-tab done">
                                                Learn array, stack, vector in c++
                                            </div>
                                            <div className="task-tab done">
                                                Solve questions on Linked List
                                            </div>
                                        </div>
                                    </Collapse>
                                </div>
                                <div className="col">
                                    <button className="collapse-btn opne" onClick={() => setOpen2(!open2)} >Task#2 </button>
                                    <Collapse in={open2}>
                                        <div id="collapse-text" className="collapse-text">
                                            <div className="task-tab notopen">
                                                Subtask#1
                                            </div>
                                            <div className="task-tab done">
                                                Subtask#2
                                            </div>
                                            <div className="task-tab open">
                                                Subtask#2
                                            </div>
                                        </div>
                                    </Collapse>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mx-3 my-2 card">
                        <a href='#' className="card-head">
                            <h5 className="card-header">Mentee2</h5>
                        </a>
                        <div className="card-body">
                            <div className="row">
                                <div className="col">
                                    <button className="collapse-btn open" onClick={() => setOpen3(!open3)} >Task#1 </button>
                                    <Collapse in={open3}>
                                        <div id="collapse-text" className="collapse-text">
                                            <div className="task-tab open">
                                                Subtask#1
                                            </div>
                                            <div className="task-tab open">
                                                Subtask#2
                                            </div>
                                            <div className="task-tab open">
                                                Subtask#2
                                            </div>
                                        </div>
                                    </Collapse>
                                </div>
                                <div className="col">
                                    <button className="collapse-btn done" onClick={() => setOpen4(!open4)} >Task#2 </button>
                                    <Collapse in={open4}>
                                        <div id="collapse-text" className="collapse-text">
                                            <div className="task-tab done">
                                                Subtask#1
                                            </div>
                                            <div className="task-tab done">
                                                Subtask#2
                                            </div>
                                            <div className="task-tab done">
                                                Subtask#2
                                            </div>
                                        </div>
                                    </Collapse>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="mx-3 my-2 card">
                        <a href='#' className="card-head">
                            <h5 className="card-header">Mentee2</h5>
                        </a>
                        <div className="card-body">
                            <div className="row">
                                <h5 className="col card-title">Task#1</h5>
                                <h5 className="col card-title">Task#2</h5>
                                <h5 className="col card-title">Task#3</h5>
                            </div>
                        </div>
                        
                    </div> */}
            </div>
        </>
    )
}