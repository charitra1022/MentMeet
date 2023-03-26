import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import profile from "./profile.png";
import "./chat.css";
export default function chat() {
    return (
        <>
            {/* Navbar */}
            <Navbar className="navcontainer">
                <Container>
                    <Navbar.Brand href="#home">
                        <h2>Chat</h2>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar className="justify-content-end">
                        <Navbar.Text>
                            <button className="Dashboardbtn">Dashboard</button>
                            <button className="logoutbtn">Logout</button>
                        </Navbar.Text>
                    </Navbar>
                </Container>
            </Navbar>
            <div className="container chatter">
                <div className="row  no-gutters">
                    <div className="col-md-4 border-right">
                        <div className="settings-tray user-header">
                            <img className="profile-image" src={profile} alt="Profile img" />
                        </div>
                        <div className="friend-drawer-contact friend-drawer--onhover">
                            <div className="text">
                                <h6>Robo Cop</h6>
                            </div>
                        </div>
                        <div className="friend-drawer-contact friend-drawer--onhover">
                            <div className="text">
                                <h6>Optimus</h6>
                            </div>
                        </div>
                        <div className="friend-drawer-contact friend-drawer--onhover ">
                            <div className="text">
                                <h6>Skynet</h6>
                            </div>
                        </div>
                        <div className="friend-drawer-contact friend-drawer--onhover">
                            <div className="text">
                                <h6>Termy</h6>
                            </div>
                        </div>
                        <div className="friend-drawer-contact friend-drawer--onhover">
                            <div className="text">
                                <h6>Richard</h6>
                            </div>
                        </div>
                        <div className="friend-drawer-contact friend-drawer--onhover">
                            <div className="text">
                                <h6>XXXXX</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 ">
                        <div class="settings-tray">
                            <div class="friend-drawer no-gutters friend-drawer--grey">
                                <img className="profile-image" src={profile} alt="" />
                                <span class="settings-tray--right">
                                    <div class="text">
                                        <h5>Robo&nbsp;Cop</h5>
                                    </div>
                                </span>
                            </div>
                        </div>
                        <div className="chat-panel">
                            <div className="chat-block">
                                <div className="row no-gutters">
                                    <div className="col-md-3">
                                        <div className="chat-bubble chat-bubble--left">
                                            1. Hello dude!
                                        </div>
                                    </div>
                                </div>
                                <div className="row no-gutters">
                                    <div className="col-md-3 offset-md-9">
                                        <div className="chat-bubble chat-bubble--right">
                                            2. Hello dude!
                                        </div>
                                    </div>
                                </div>
                                <div className="row no-gutters">
                                    <div className="col-md-3 offset-md-9">
                                        <div className="chat-bubble chat-bubble--right">
                                            3. Hello dude!
                                        </div>
                                    </div>
                                </div>
                                <div className="row no-gutters">
                                    <div className="col-md-3">
                                        <div className="chat-bubble chat-bubble--left">
                                            4. Hello dude!
                                        </div>
                                    </div>
                                </div>
                                <div className="row no-gutters">
                                    <div className="col-md-3">
                                        <div className="chat-bubble chat-bubble--left">
                                            5. Hello dude!
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="chat-box-tray">
                                        <input type="text" placeholder="Type your message here..." />
                                        <button className="sendbtn">send</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
