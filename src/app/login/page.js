"use client"
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {

    const router = useRouter()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        setMessage(data.message);
        setIsSuccess(res.ok);
        setShowModal(true);

        setTimeout(() => {
            setLoading(false);
        }, 2500);
    };

    function handleCloseModal() {
        setShowModal(false);
        setMessage("");
        if (isSuccess) {
            router.push("/dashboard");
        }
    }

    useEffect(() => {
        async function checkLogin() {
            const res = await fetch("/api/me", {
                method: "GET",
                credentials: "include",
            });

            if (res.ok) {
                router.push("/dashboard");
            }
        }
        checkLogin();
    }, []);

    return (
        <>
            <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
                    backgroundSize: '400% 400%',
                    animation: 'gradientShift 15s ease infinite',
                }}>

                {/* Animated Background Elements */}
                <div className="position-absolute w-100 h-100" style={{ zIndex: 1 }}>
                    <div className="position-absolute rounded-circle"
                        style={{
                            width: '300px',
                            height: '300px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            top: '10%',
                            left: '10%',
                            animation: 'float 6s ease-in-out infinite'
                        }}></div>
                    <div className="position-absolute rounded-circle"
                        style={{
                            width: '200px',
                            height: '200px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            bottom: '15%',
                            right: '15%',
                            animation: 'float 8s ease-in-out infinite reverse'
                        }}></div>
                    <div className="position-absolute rounded-circle"
                        style={{
                            width: '150px',
                            height: '150px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            top: '60%',
                            left: '5%',
                            animation: 'float 10s ease-in-out infinite'
                        }}></div>
                </div>

                <div className="container position-relative" style={{ zIndex: 2 }}>
                    <div className="row justify-content-center">
                        <div className="col-md-5 col-lg-4">

                            <div className="card border-0 shadow-lg position-relative"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '25px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    boxShadow: '0 25px 45px rgba(0, 0, 0, 0.2)',
                                    transform: 'translateY(0)',
                                    transition: 'all 0.3s ease',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 35px 60px rgba(0, 0, 0, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 25px 45px rgba(0, 0, 0, 0.2)';
                                }}
                            >
                                {/* Card Glow Effect */}
                                <div className="position-absolute w-100 h-100"
                                    style={{
                                        background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
                                        borderRadius: '25px',
                                        zIndex: 1
                                    }}></div>

                                <div className="card-body p-5 position-relative" style={{ zIndex: 2 }}>
                                    <div className="text-center mb-4">

                                        <h2 className="text-white mb-2 thai-extra-bold"
                                            style={{
                                                fontSize: '28px',
                                                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                                                letterSpacing: '0.5px'
                                            }}>
                                            เข้าสู่ระบบ
                                        </h2>
                                        <p className="text-white mb-0 thai-light"
                                            style={{
                                                opacity: 0.9,
                                                fontSize: '16px',
                                                textShadow: '0 1px 5px rgba(0,0,0,0.2)'
                                            }}>
                                            เข้าสู่ระบบเพื่อร่วมใช้งานกับพวกเรา !
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                            <label htmlFor="username" className="form-label text-white thai-medium mb-2"
                                                style={{
                                                    fontSize: '14px',
                                                    opacity: 0.9,
                                                    textShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                                }}>
                                                ชื่อผู้ใช้
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg border-0 thai-medium"
                                                id="username"
                                                name="username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="กรอกชื่อผู้ใช้ของคุณ"
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                    color: 'white',
                                                    borderRadius: '15px',
                                                    fontSize: '16px',
                                                    padding: '15px 20px',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    transition: 'all 0.3s ease',
                                                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                                                    e.target.style.border = '1px solid rgba(255,255,255,0.4)';
                                                    e.target.style.transform = 'translateY(-2px)';
                                                    e.target.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2), inset 0 2px 10px rgba(0,0,0,0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                                                    e.target.style.border = '1px solid rgba(255,255,255,0.2)';
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = 'inset 0 2px 10px rgba(0,0,0,0.1)';
                                                }}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="password" className="form-label text-white thai-medium mb-2"
                                                style={{
                                                    fontSize: '14px',
                                                    opacity: 0.9,
                                                    textShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                                }}>
                                                รหัสผ่าน
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control form-control-lg border-0 thai-medium"
                                                id="password"
                                                name="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="กรอกรหัสผ่านของคุณ"
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                    color: 'white',
                                                    borderRadius: '15px',
                                                    fontSize: '16px',
                                                    padding: '15px 20px',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    transition: 'all 0.3s ease',
                                                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                                                    e.target.style.border = '1px solid rgba(255,255,255,0.4)';
                                                    e.target.style.transform = 'translateY(-2px)';
                                                    e.target.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2), inset 0 2px 10px rgba(0,0,0,0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                                                    e.target.style.border = '1px solid rgba(255,255,255,0.2)';
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = 'inset 0 2px 10px rgba(0,0,0,0.1)';
                                                }}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-lg w-100 d-flex align-items-center justify-content-center thai-bold mt-4 position-relative overflow-hidden"
                                            disabled={loading}
                                            style={{
                                                background: loading
                                                    ? 'rgba(102, 126, 234, 0.6)'
                                                    : 'linear-gradient(45deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                                                backgroundSize: '200% 200%',
                                                border: 'none',
                                                borderRadius: '15px',
                                                height: '60px',
                                                fontSize: '18px',
                                                transition: 'all 0.4s ease',
                                                transform: loading ? 'scale(0.98)' : 'scale(1)',
                                                cursor: loading ? 'not-allowed' : 'pointer',
                                                boxShadow: loading
                                                    ? '0 4px 15px rgba(0,0,0,0.2)'
                                                    : '0 8px 25px rgba(102, 126, 234, 0.4)',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                letterSpacing: '0.5px',
                                                textShadow: '0 2px 5px rgba(0,0,0,0.3)',
                                                animation: loading ? 'none' : 'buttonGradient 3s ease infinite'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!loading) {
                                                    e.target.style.transform = 'translateY(-3px) scale(1.02)';
                                                    e.target.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.6)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!loading) {
                                                    e.target.style.transform = 'translateY(0px) scale(1)';
                                                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                                                }
                                            }}
                                        >
                                            {loading && (
                                                <div
                                                    className="spinner-border spinner-border-sm me-3"
                                                    role="status"
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        borderWidth: '2px'
                                                    }}
                                                >
                                                    <span className="visually-hidden">กำลังโหลด...</span>
                                                </div>
                                            )}
                                            {loading ? 'กำลังเข้าระบบ...' : 'เข้าสู่ระบบ'}
                                        </button>
                                    </form>
                                    <div className="text-center mt-4">
                                        <p className="text-white mb-0 thai-light"
                                            style={{
                                                fontSize: '14px',
                                                opacity: 0.8,
                                                textShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                            }}>
                                            ยังไม่มีบัญชี? <Link href="/register" className="text-white thai-bold">สมัครสมาชิก</Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex={-1}
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(5px)',
                        zIndex: 9999
                    }}
                    onClick={handleCloseModal}
                >
                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div
                            className="modal-content border-0 position-relative overflow-hidden"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '25px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
                                animation: 'modalSlideIn 0.4s ease-out'
                            }}
                        >
                            {/* Modal Gradient Background */}
                            <div className="position-absolute w-100 h-100"
                                style={{
                                    background: isSuccess
                                        ? 'linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(25, 135, 84, 0.05) 100%)'
                                        : 'linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(176, 42, 55, 0.05) 100%)',
                                    borderRadius: '25px',
                                    zIndex: 1
                                }}></div>

                            <div className="modal-header border-0 pb-2 position-relative" style={{ zIndex: 2 }}>
                                <div className="d-flex align-items-center">
                                    <div className="me-3 d-flex align-items-center justify-content-center rounded-circle"
                                        style={{
                                            width: '45px',
                                            height: '45px',
                                            background: isSuccess
                                                ? 'linear-gradient(45deg, #28a745, #20c997)'
                                                : 'linear-gradient(45deg, #dc3545, #fd7e14)',
                                            color: 'white',
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            boxShadow: isSuccess
                                                ? '0 4px 15px rgba(40, 167, 69, 0.3)'
                                                : '0 4px 15px rgba(220, 53, 69, 0.3)'
                                        }}>
                                        {isSuccess ? '✓' : '✕'}
                                    </div>
                                    <h5 className={`modal-title thai-bold mb-0 ${isSuccess ? 'text-success' : 'text-danger'}`}
                                        style={{
                                            fontSize: '20px',
                                            textShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                        }}>
                                        {isSuccess ? 'เข้าสู่ระบบสำเร็จ!' : 'เกิดข้อผิดพลาด!'}
                                    </h5>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close position-relative"
                                    onClick={handleCloseModal}
                                    style={{
                                        filter: 'none',
                                        opacity: 0.6,
                                        fontSize: '14px',
                                        zIndex: 3
                                    }}
                                ></button>
                            </div>

                            <div className="modal-body pt-0 pb-2 position-relative" style={{ zIndex: 2 }}>
                                <div className="p-3 rounded-3"
                                    style={{
                                        backgroundColor: isSuccess
                                            ? 'rgba(40, 167, 69, 0.1)'
                                            : 'rgba(220, 53, 69, 0.1)',
                                        border: `1px solid ${isSuccess ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)'}`,
                                        backdropFilter: 'blur(10px)'
                                    }}>
                                    <p className={`mb-2 thai-medium ${isSuccess ? 'text-success' : 'text-danger'}`}
                                        style={{
                                            fontSize: '16px',
                                            fontWeight: '600'
                                        }}>
                                        {message}
                                    </p>
                                    {isSuccess && (
                                        <div className="d-flex align-items-center mt-3">
                                            <div className="spinner-border spinner-border-sm text-success me-2"
                                                style={{ width: '16px', height: '16px' }}>
                                                <span className="visually-hidden">กำลังโหลด...</span>
                                            </div>
                                            <p className="mb-0 text-muted thai-light" style={{ fontSize: '14px' }}>
                                                กำลังพาไปยังหน้าแดชบอร์ด...
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-footer border-0 pt-0 position-relative" style={{ zIndex: 2 }}>
                                <button
                                    type="button"
                                    className={`btn thai-medium px-4 py-2 ${isSuccess ? 'btn-success' : 'btn-danger'}`}
                                    onClick={handleCloseModal}
                                    style={{
                                        borderRadius: '15px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        minWidth: '100px',
                                        transition: 'all 0.3s ease',
                                        boxShadow: isSuccess
                                            ? '0 4px 15px rgba(40, 167, 69, 0.3)'
                                            : '0 4px 15px rgba(220, 53, 69, 0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = isSuccess
                                            ? '0 6px 20px rgba(40, 167, 69, 0.4)'
                                            : '0 6px 20px rgba(220, 53, 69, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = isSuccess
                                            ? '0 4px 15px rgba(40, 167, 69, 0.3)'
                                            : '0 4px 15px rgba(220, 53, 69, 0.3)';
                                    }}
                                >
                                    ตกลง
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}