'use client';
import React from 'react'
import { useEffect, useState } from 'react';
export default function AdminPage() {
    useEffect(() => {
        const storedStudentData = localStorage.getItem('studentData');
        if (!storedStudentData) {
          window.location.href = '/login'; // Redirect if no student data is found
        } 
      }, []);
      
  return (
    <div>helloworld</div>
  )
}
