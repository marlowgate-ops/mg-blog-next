"use client";
import React, { useEffect, useState } from "react";
export default function BackToTop(){
  const [show, setShow] = useState(false);
  useEffect(()=>{
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  },[]);
  return show ? (
    <button aria-label="ページ上部へ戻る" className="mg-top" onClick={()=>window.scrollTo({top:0, behavior:'smooth'})}>TOP
      <style jsx>{`
        .mg-top{ position: fixed; right: 16px; bottom: 16px; background:#111827; color:#fff; border:none; border-radius:8px; padding:8px 10px; font-weight:700; }
      `}</style>
    </button>
  ) : null;
}
