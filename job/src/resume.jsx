import React, { useEffect, useState } from "react";
import axios from "axios";
import "./resume.css";

export default function ResumeBuilder() {
  const [formData, setFormData] = useState({
  title: '',
  company: '',
  location: '',
  type: 'Full-Time',
  salary: '',
  description: '',
  requirements: '',
  skills: [],
  experience: ''
});
``
}
