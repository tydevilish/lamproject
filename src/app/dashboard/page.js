"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const [myPosts, setMyPosts] = useState([]);
    const [otherPosts, setOtherPosts] = useState([]);
    const [showAddPostModal, setShowAddPostModal] = useState(false);
    const [newPost, setNewPost] = useState({ title: "", content: "", language: "javascript" });
    const [editingPost, setEditingPost] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function fetchMyPosts() {
        setLoading(true);
        try {
            const res = await fetch("/api/myPosts", {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok) {
                setMyPosts(data.posts);
            } else {
                console.error("โหลดโพสต์ไม่สำเร็จ:", data.error);
            }
        } catch (err) {
            console.error("เกิดข้อผิดพลาด:", err);
        } finally {
            setLoading(false);
        }
    }


    async function fetchOtherPosts() {
        setLoading(true);
        try {
            const res = await fetch("/api/otherPosts", {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok) {
                setOtherPosts(data.posts);
            } else {
                console.error("โหลดโพสต์ไม่สำเร็จ:", data.error);
            }
        } catch (err) {
            console.error("เกิดข้อผิดพลาด:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const resUser = await fetch("/api/me", { credentials: "include" });
                if (!resUser.ok) return router.push("/login");

                const userData = await resUser.json();
                setUser(userData.user);

                await fetchMyPosts();
                await fetchOtherPosts();
            } catch (err) {
                console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", err);
                router.push("/login");
            }
        }

        fetchData();
    }, []);


    const handleLogout = async () => {
        await fetch("/api/logout", {
            method: "POST",
            credentials: "include",
        });
        router.push("/login");
    };

    const handleAddPost = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(newPost),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "เกิดข้อผิดพลาด");
            } else {
                setMyPosts([data.post, ...myPosts]);
                setNewPost({ title: "", content: "", language: "javascript" });
                setShowAddPostModal(false);
            }
        } catch (err) {
            console.error("Error posting:", err);
            alert("เกิดข้อผิดพลาดในการส่งโพสต์");
        } finally {
            setLoading(false);
        }
    };


    const handleEditPost = (post) => {
        setEditingPost(post);
        setShowEditModal(true);
    };

    const handleUpdatePost = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/posts/${editingPost._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: editingPost.title,
                    content: editingPost.content,
                    language: editingPost.language,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                await fetchMyPosts();
                setShowEditModal(false);
                setEditingPost(null);
            } else {
                console.error("อัปเดตไม่สำเร็จ:", data.error);
            }
        } catch (err) {
            console.error("เกิดข้อผิดพลาด:", err);
        } finally {
            setLoading(false);
        }
    };


    const handleDeletePost = async (postId) => {
        if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบโพสต์นี้?")) return;

        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (res.ok) {
                setMyPosts((prev) => prev.filter((post) => post._id !== postId));
            } else {
                console.error("ลบไม่สำเร็จ:", data.error);
            }
        } catch (err) {
            console.error("เกิดข้อผิดพลาด:", err);
        }
    };



    const renderCodeContent = (content) => {

        const parts = content.split("```");

        return parts.map((part, index) => {
            if (index % 2 === 1) {
                const lines = part.split('\n');
                const language = lines[0] || 'text';
                const code = lines.slice(1).join('\n');

                return (
                    <pre key={index} className="mb-3 p-3 rounded"
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: '#f8f8f2',
                            fontSize: '13px',
                            lineHeight: '1.4',
                            overflow: 'auto',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                        <div className="d-flex justify-content-between align-items-center mb-2 pb-2"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <small style={{ color: '#50fa7b', fontSize: '11px' }}>{language}</small>
                        </div>
                        <code style={{ color: '#f8f8f2' }}>{code}</code>
                    </pre>
                );
            } else {
                return part.trim() && (
                    <p key={index} className="mb-2" style={{
                        whiteSpace: 'pre-wrap',
                        fontSize: '14px',
                        lineHeight: '1.6'
                    }}>
                        {part.trim()}
                    </p>
                );
            }
        });
    };


    if (!user) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
                    backgroundSize: '400% 400%',
                    animation: 'gradientShift 15s ease infinite',
                }}>
                <div className="spinner-border text-white" role="status">
                    <span className="visually-hidden">กำลังโหลด...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-vh-100"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
                    backgroundSize: '400% 400%',
                    animation: 'gradientShift 15s ease infinite',
                }}>

                {/* Animated Background Elements */}
                <div className="position-absolute w-100 h-100" style={{ zIndex: 1, overflow: 'hidden' }}>
                    <div className="position-absolute rounded-circle"
                        style={{
                            width: '300px', height: '300px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            top: '10%', left: '10%',
                            animation: 'float 6s ease-in-out infinite'
                        }}></div>
                    <div className="position-absolute rounded-circle"
                        style={{
                            width: '200px', height: '200px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            bottom: '15%', right: '15%',
                            animation: 'float 8s ease-in-out infinite reverse'
                        }}></div>
                    <div className="position-absolute rounded-circle"
                        style={{
                            width: '150px', height: '150px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            top: '60%', left: '5%',
                            animation: 'float 10s ease-in-out infinite'
                        }}></div>
                </div>

                {/* Navbar */}
                <nav className="navbar navbar-expand-lg position-relative" style={{ zIndex: 2 }}>
                    <div className="container">
                        <div className="navbar-brand text-white thai-extra-bold d-flex align-items-center"
                            style={{
                                fontSize: '24px',
                                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                            }}>
                            <span className="me-2">📊</span>
                            Dashboard
                        </div>

                        <div className="d-flex align-items-center">
                            <div className="me-4 text-white thai-medium">
                                <span style={{ opacity: 0.8 }}>สวัสดีคุณ</span>
                                <span className="thai-bold ms-1" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.3)' }}>
                                    {user.username}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn btn-outline-light thai-medium"
                                style={{
                                    borderRadius: '15px',
                                    padding: '8px 20px',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                ออกจากระบบ
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="container position-relative" style={{ zIndex: 2, paddingBottom: '50px' }}>

                    {/* My Posts Section */}
                    <div className="row mb-5">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="text-white thai-extra-bold mb-0"
                                    style={{
                                        fontSize: '28px',
                                        textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                                    }}>
                                    โพสต์ของฉัน
                                </h2>
                                <button
                                    onClick={() => setShowAddPostModal(true)}
                                    className="btn btn-light thai-bold d-flex align-items-center"
                                    style={{
                                        borderRadius: '20px',
                                        padding: '12px 25px',
                                        fontSize: '16px',
                                        background: 'rgba(255,255,255,0.9)',
                                        backdropFilter: 'blur(10px)',
                                        border: 'none',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-3px)';
                                        e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                    }}
                                >
                                    <span className="me-2">➕</span>
                                    เพิ่มโพสต์ใหม่
                                </button>
                            </div>

                            <div className="row">
                                {myPosts.map((post) => (
                                    <div key={post._id} className="col-md-6 col-lg-4 mb-4">
                                        <div className="card border-0 shadow-lg post-card h-100"
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                backdropFilter: 'blur(20px)',
                                                borderRadius: '20px',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
                                            }}>
                                            <div className="card-body p-4">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <h5 className="card-title text-white thai-bold mb-0"
                                                        style={{
                                                            fontSize: '18px',
                                                            textShadow: '0 1px 5px rgba(0,0,0,0.2)',
                                                            flex: 1
                                                        }}>
                                                        {post.title}
                                                    </h5>
                                                    <div className="dropdown ms-2">
                                                        <button
                                                            className="btn btn-sm text-white"
                                                            style={{
                                                                background: 'rgba(255,255,255,0.1)',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                fontSize: '16px',
                                                                width: '32px',
                                                                height: '32px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                            type="button"
                                                            data-bs-toggle="dropdown"
                                                        >
                                                            ⋮
                                                        </button>
                                                        <ul className="dropdown-menu dropdown-menu-end"
                                                            style={{
                                                                backgroundColor: 'rgba(255,255,255,0.95)',
                                                                backdropFilter: 'blur(10px)',
                                                                border: '1px solid rgba(0,0,0,0.1)',
                                                                borderRadius: '12px'
                                                            }}>
                                                            <li>
                                                                <button
                                                                    className="dropdown-item thai-medium d-flex align-items-center"
                                                                    onClick={() => handleEditPost(post)}
                                                                    style={{ fontSize: '14px' }}
                                                                >
                                                                    <span className="me-2">✏️</span>
                                                                    แก้ไข
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    className="dropdown-item thai-medium d-flex align-items-center text-danger"
                                                                    onClick={() => handleDeletePost(post._id)}
                                                                    style={{ fontSize: '14px' }}
                                                                >
                                                                    <span className="me-2">🗑️</span>
                                                                    ลบ
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <small className="text-white thai-light d-flex justify-content-between"
                                                        style={{ opacity: 0.7, fontSize: '12px' }}>
                                                        <span>{post.createdAt}</span>
                                                        {post.updatedAt && <span>(แก้ไข: {post.updatedAt})</span>}
                                                    </small>
                                                </div>
                                                <div className="text-white thai-medium"
                                                    style={{ opacity: 0.9 }}>
                                                    {renderCodeContent(post.content)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {myPosts.length === 0 && (
                                    <div className="col-12 text-center">
                                        <div className="card border-0"
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(20px)',
                                                borderRadius: '20px',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                padding: '40px'
                                            }}>
                                            <p className="text-white thai-medium mb-0"
                                                style={{ opacity: 0.7, fontSize: '18px' }}>
                                                ยังไม่มีโพสต์ เริ่มต้นโพสต์แรกของคุณกันเลย!
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Other Posts Section */}
                    <div className="row">
                        <div className="col-12">
                            <h2 className="text-white thai-extra-bold mb-4"
                                style={{
                                    fontSize: '28px',
                                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                                }}>
                                โพสต์ของคนอื่นๆ
                            </h2>

                            <div className="row">
                                {otherPosts.map((post) => (
                                    <div key={post.id} className="col-md-6 col-lg-4 mb-4">
                                        <div className="card border-0 shadow-lg post-card h-100"
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                                                backdropFilter: 'blur(20px)',
                                                borderRadius: '20px',
                                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
                                            }}>
                                            <div className="card-body p-4">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <h5 className="card-title text-white thai-bold mb-0"
                                                        style={{
                                                            fontSize: '18px',
                                                            textShadow: '0 1px 5px rgba(0,0,0,0.2)'
                                                        }}>
                                                        {post.title}
                                                    </h5>
                                                    <small className="text-white thai-light"
                                                        style={{ opacity: 0.7, fontSize: '12px' }}>
                                                        {post.createdAt}
                                                    </small>
                                                </div>
                                                <p className="text-white thai-light mb-3"
                                                    style={{
                                                        opacity: 0.6,
                                                        fontSize: '13px',
                                                        margin: '0 0 12px 0'
                                                    }}>
                                                    โดย {post.author}
                                                </p>
                                                <div className="text-white thai-medium"
                                                    style={{ opacity: 0.9 }}>
                                                    {renderCodeContent(post.content)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {otherPosts.length === 0 && (
                                    <div className="col-12 text-center">
                                        <div className="card border-0"
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(20px)',
                                                borderRadius: '20px',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                padding: '40px'
                                            }}>
                                            <p className="text-white thai-medium mb-0"
                                                style={{ opacity: 0.7, fontSize: '18px' }}>
                                                คนอื่น ๆ ยังไม่มีใครโพสต์อะไรเลยหรอเนี้ยยย!
                                            </p>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showAddPostModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex={-1}
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(5px)',
                        zIndex: 9999
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
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
                            <div className="position-absolute w-100 h-100"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
                                    borderRadius: '25px',
                                    zIndex: 1
                                }}></div>

                            <div className="modal-header border-0 pb-2 position-relative" style={{ zIndex: 2 }}>
                                <h5 className="modal-title thai-bold"
                                    style={{
                                        fontSize: '24px',
                                        color: '#333',
                                        textShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                    }}>
                                    ➕ เพิ่มโพสต์ใหม่
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowAddPostModal(false)}
                                ></button>
                            </div>

                            <form onSubmit={handleAddPost}>
                                <div className="modal-body position-relative" style={{ zIndex: 2 }}>
                                    <div className="mb-4">
                                        <label className="form-label thai-medium" style={{ color: '#333', fontSize: '16px' }}>
                                            หัวข้อโพสต์
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg thai-medium custom-placeholder"
                                            value={newPost.title}
                                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                            placeholder="กรอกหัวข้อโพสต์ของคุณ"
                                            required
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                border: '1px solid rgba(0,0,0,0.1)',
                                                borderRadius: '15px',
                                                fontSize: '16px',
                                                padding: '15px 20px',
                                                color: 'black'
                                            }}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label thai-medium" style={{ color: '#333', fontSize: '16px' }}>
                                            ภาษาการเขียนโปรแกรม
                                        </label>
                                        <select
                                            className="form-select thai-medium"
                                            value={newPost.language}
                                            onChange={(e) => setNewPost({ ...newPost, language: e.target.value })}
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                border: '1px solid rgba(0,0,0,0.1)',
                                                borderRadius: '15px',
                                                fontSize: '16px',
                                                padding: '15px 20px',
                                                color: '#333'
                                            }}
                                        >
                                            <option value="javascript">JavaScript</option>
                                            <option value="python">Python</option>
                                            <option value="java">Java</option>
                                            <option value="cpp">C++</option>
                                            <option value="css">CSS</option>
                                            <option value="html">HTML</option>
                                            <option value="sql">SQL</option>
                                            <option value="php">PHP</option>
                                            <option value="go">Go</option>
                                            <option value="rust">Rust</option>
                                            <option value="text">Text/Other</option>
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label thai-medium" style={{ color: '#333', fontSize: '16px' }}>
                                            เนื้อหา
                                        </label>
                                        <div className="mb-2">
                                            <small className="text-muted thai-light">
                                                💡 ใช้ ```language กับ ``` เพื่อครอบโค้ด เช่น ```javascript
                                            </small>
                                        </div>
                                        <textarea
                                            className="form-control thai-medium"
                                            rows="8"
                                            value={newPost.content}
                                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                            placeholder="อธิบายโค้ดของคุณ (ถ้ามี)&#10;&#10;```javascript&#10;// เขียนโค้ดของคุณที่นี่&#10;console.log('Hello World!');&#10;```"
                                            required
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                border: '1px solid rgba(0,0,0,0.1)',
                                                borderRadius: '15px',
                                                fontSize: '14px',
                                                padding: '15px 20px',
                                                color: '#333',
                                                resize: 'vertical',
                                                fontFamily: 'monospace'
                                            }}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="modal-footer border-0 position-relative" style={{ zIndex: 2 }}>
                                    <button
                                        type="button"
                                        className="btn btn-secondary thai-medium"
                                        onClick={() => setShowAddPostModal(false)}
                                        style={{
                                            borderRadius: '15px',
                                            padding: '10px 25px'
                                        }}
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn thai-bold"
                                        disabled={loading}
                                        style={{
                                            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                                            border: 'none',
                                            borderRadius: '15px',
                                            padding: '10px 25px',
                                            color: 'white',
                                            fontSize: '16px',
                                            minWidth: '120px'
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                กำลังโพสต์...
                                            </>
                                        ) : (
                                            'โพสต์เลย!'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Post Modal */}
            {showEditModal && editingPost && (
                <div
                    className="modal fade show d-block"
                    tabIndex={-1}
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(5px)',
                        zIndex: 9999
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
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
                            <div className="position-absolute w-100 h-100"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
                                    borderRadius: '25px',
                                    zIndex: 1
                                }}></div>

                            <div className="modal-header border-0 pb-2 position-relative" style={{ zIndex: 2 }}>
                                <h5 className="modal-title thai-bold"
                                    style={{
                                        fontSize: '24px',
                                        color: '#333',
                                        textShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                    }}>
                                    ✏️ แก้ไขโพสต์
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowEditModal(false)}
                                ></button>
                            </div>

                            <form onSubmit={handleUpdatePost}>
                                <div className="modal-body position-relative" style={{ zIndex: 2 }}>
                                    <div className="mb-4">
                                        <label className="form-label thai-medium" style={{ color: '#333', fontSize: '16px' }}>
                                            หัวข้อโพสต์
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg thai-medium"
                                            value={editingPost.title}
                                            onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                                            placeholder="กรอกหัวข้อโพสต์ของคุณ"
                                            required
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                border: '1px solid rgba(0,0,0,0.1)',
                                                borderRadius: '15px',
                                                fontSize: '16px',
                                                padding: '15px 20px',
                                                color: '#333'
                                            }}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label thai-medium" style={{ color: '#333', fontSize: '16px' }}>
                                            ภาษาการเขียนโปรแกรม
                                        </label>
                                        <select
                                            className="form-select thai-medium"
                                            value={editingPost.language}
                                            onChange={(e) => setEditingPost({ ...editingPost, language: e.target.value })}
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                border: '1px solid rgba(0,0,0,0.1)',
                                                borderRadius: '15px',
                                                fontSize: '16px',
                                                padding: '15px 20px',
                                                color: '#333'
                                            }}
                                        >
                                            <option value="javascript">JavaScript</option>
                                            <option value="python">Python</option>
                                            <option value="java">Java</option>
                                            <option value="cpp">C++</option>
                                            <option value="css">CSS</option>
                                            <option value="html">HTML</option>
                                            <option value="sql">SQL</option>
                                            <option value="php">PHP</option>
                                            <option value="go">Go</option>
                                            <option value="rust">Rust</option>
                                            <option value="text">Text/Other</option>
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label thai-medium" style={{ color: '#333', fontSize: '16px' }}>
                                            เนื้อหา
                                        </label>
                                        <div className="mb-2">
                                            <small className="text-muted thai-light">
                                                💡 ใช้ ```language กับ ``` เพื่อครอบโค้ด เช่น ```javascript
                                            </small>
                                        </div>
                                        <textarea
                                            className="form-control thai-medium"
                                            rows="8"
                                            value={editingPost.content}
                                            onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                                            placeholder="อธิบายโค้ดของคุณ (ถ้ามี)&#10;&#10;```javascript&#10;// เขียนโค้ดของคุณที่นี่&#10;console.log('Hello World!');&#10;```"
                                            required
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                border: '1px solid rgba(0,0,0,0.1)',
                                                borderRadius: '15px',
                                                fontSize: '14px',
                                                padding: '15px 20px',
                                                color: '#333',
                                                resize: 'vertical',
                                                fontFamily: 'monospace'
                                            }}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="modal-footer border-0 position-relative" style={{ zIndex: 2 }}>
                                    <button
                                        type="button"
                                        className="btn btn-secondary thai-medium"
                                        onClick={() => setShowEditModal(false)}
                                        style={{
                                            borderRadius: '15px',
                                            padding: '10px 25px'
                                        }}
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn thai-bold"
                                        disabled={loading}
                                        style={{
                                            background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
                                            border: 'none',
                                            borderRadius: '15px',
                                            padding: '10px 25px',
                                            color: 'white',
                                            fontSize: '16px',
                                            minWidth: '120px'
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                กำลังอัปเดต...
                                            </>
                                        ) : (
                                            'อัปเดต'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
