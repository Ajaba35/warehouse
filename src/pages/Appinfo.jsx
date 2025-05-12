import HeaderTitle from "../components/HeaderTitle.jsx";
import React, {useEffect} from "react";

const Appinfo = () => {
    useEffect(() => {
        document.title = 'App Information';
    }, []);
    return (
        <>
            <HeaderTitle title="App Information" display="none"/>
            <div className="general-data">
                <div className="data-box">
                    <div className="app-info">
                        <h3 style={{ marginBottom: '20px' }}>📦 General</h3>
                        <p><strong>Version:</strong> 1.0.0</p>
                        <p><strong>Last Updated:</strong> May 2025</p>
                        <p><strong>Developer:</strong> Ayoub Ajaba</p>

                        <hr style={{ margin: '1.5rem 0' }} />

                        <h3 style={{ marginBottom: '20px' }}>📘 About</h3>
                        <p>
                            This is a wholesale warehouse management system built to simplify inventory tracking, user access management,
                            and operational oversight. It supports multiple roles and aims to provide a seamless, efficient experience.
                        </p>

                        <hr style={{ margin: '1.5rem 0' }} />

                        <h3 style={{ marginBottom: '20px' }}>👨‍💻 Developer Note</h3>
                        <p>
                            Hi! I'm <strong>Ayoub Ajaba</strong>, the developer behind this system. I built this project to solve real-world
                            inventory problems in a way that’s both intuitive and scalable. If you run into bugs or have ideas for improvement,
                            feel free to reach out—continuous improvement is the goal!
                        </p>
                        <p><strong>Email : </strong> ajaba35@gmail.com</p>
                        <p><strong>Phone : </strong> +212 6 93 52 95 13</p>

                        <hr style={{ margin: '1.5rem 0' }} />

                        <h3 style={{ marginBottom: '20px' }}>📢 Upcoming Updates</h3>
                        <p>- Pagination System for All Tables</p>
                        <p>- Messaging System</p>
                        <p>- Notification System</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Appinfo