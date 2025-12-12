// src/data/skills.js

export const skillsData = [
  {
    category: 'IT & Software Development',
    skills: [
      'JavaScript',
      'React',
      'Angular',
      'Vue.js',
      'Node.js',
      'Python',
      'Java',
      'C++',
      'PHP',
      'Ruby',
      'Swift',
      'Kotlin',
      'TypeScript',
      'HTML/CSS',
      'SQL',
      'MongoDB',
      'PostgreSQL',
      'MySQL',
      'Redis',
      'Docker',
      'Kubernetes',
      'AWS',
      'Azure',
      'Google Cloud',
      'Git',
      'REST APIs',
      'GraphQL',
      'Machine Learning',
      'Data Science',
      'Artificial Intelligence',
      'DevOps',
      'Blockchain',
      'Cybersecurity'
    ]
  },
  {
    category: 'Finance & Accounting',
    skills: [
      'Financial Analysis',
      'Financial Reporting',
      'Budgeting',
      'Forecasting',
      'Tax Preparation',
      'Auditing',
      'Cost Accounting',
      'Management Accounting',
      'Financial Planning',
      'Investment Analysis',
      'Risk Management',
      'Corporate Finance',
      'Treasury Management',
      'Bookkeeping',
      'Account Reconciliation',
      'Financial Modeling',
      'Variance Analysis',
      'IFRS',
      'GAAP',
      'GST Compliance',
      'Income Tax'
    ]
  },
  {
    category: 'Computerized Accounting',
    skills: [
      'Tally ERP 9',
      'Tally Prime',
      'QuickBooks',
      'SAP FICO',
      'Oracle Financials',
      'Zoho Books',
      'Xero',
      'FreshBooks',
      'MYOB',
      'Sage 50',
      'Wave Accounting',
      'Microsoft Dynamics',
      'NetSuite',
      'Busy Accounting',
      'Marg ERP'
    ]
  },
  {
    category: 'Management & Leadership',
    skills: [
      'Project Management',
      'Team Leadership',
      'Strategic Planning',
      'Business Development',
      'Operations Management',
      'Change Management',
      'Risk Management',
      'Quality Management',
      'Agile Methodology',
      'Scrum Master',
      'Product Management',
      'Stakeholder Management',
      'Vendor Management',
      'Resource Planning',
      'Budget Management',
      'Performance Management',
      'Conflict Resolution',
      'Decision Making'
    ]
  },
  {
    category: 'Marketing & Sales',
    skills: [
      'Digital Marketing',
      'SEO',
      'SEM',
      'Social Media Marketing',
      'Content Marketing',
      'Email Marketing',
      'Marketing Analytics',
      'Brand Management',
      'Market Research',
      'Sales Strategy',
      'Business Development',
      'Lead Generation',
      'Customer Relationship Management',
      'Negotiation',
      'B2B Sales',
      'B2C Sales',
      'Account Management',
      'Cold Calling'
    ]
  },
  {
    category: 'Soft Skills',
    skills: [
      'Communication',
      'Problem Solving',
      'Critical Thinking',
      'Teamwork',
      'Time Management',
      'Adaptability',
      'Leadership',
      'Creativity',
      'Attention to Detail',
      'Work Ethics',
      'Emotional Intelligence',
      'Interpersonal Skills',
      'Presentation Skills',
      'Active Listening',
      'Conflict Management',
      'Stress Management',
      'Self-Motivation',
      'Collaboration'
    ]
  },
  {
    category: 'Design & Creative',
    skills: [
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Adobe XD',
      'Figma',
      'Sketch',
      'UI Design',
      'UX Design',
      'Graphic Design',
      'Logo Design',
      'Branding',
      'Typography',
      'Color Theory',
      'Wireframing',
      'Prototyping',
      'Animation',
      'Video Editing',
      'Adobe Premiere Pro',
      'After Effects',
      '3D Modeling'
    ]
  },
  {
    category: 'Data & Analytics',
    skills: [
      'Data Analysis',
      'Data Visualization',
      'Excel',
      'Power BI',
      'Tableau',
      'SQL',
      'Python (Pandas)',
      'R Programming',
      'Statistics',
      'Business Intelligence',
      'ETL',
      'Data Mining',
      'Predictive Analytics',
      'A/B Testing',
      'Google Analytics',
      'Big Data',
      'Apache Spark',
      'Hadoop'
    ]
  },
  {
    category: 'HR & Recruitment',
    skills: [
      'Recruitment',
      'Talent Acquisition',
      'Employee Relations',
      'Performance Management',
      'Training & Development',
      'HR Policies',
      'Compensation & Benefits',
      'Payroll Management',
      'HRIS',
      'Onboarding',
      'Exit Management',
      'Employee Engagement',
      'Diversity & Inclusion',
      'Workforce Planning',
      'HR Analytics'
    ]
  },
  {
    category: 'Customer Service',
    skills: [
      'Customer Support',
      'Technical Support',
      'Help Desk',
      'Call Center',
      'Live Chat Support',
      'Email Support',
      'Customer Success',
      'CRM Software',
      'Zendesk',
      'Freshdesk',
      'Complaint Handling',
      'Customer Retention',
      'Service Excellence',
      'Product Knowledge'
    ]
  }
];

// Helper function to convert to react-select format
export const getSkillsForReactSelect = () => {
  return skillsData.map(category => ({
    label: category.category,
    options: category.skills.map(skill => ({
      value: skill,
      label: skill
    }))
  }));
};

// Helper function to get all skills as flat array
export const getAllSkills = () => {
  return skillsData.flatMap(category => category.skills);
};

// Helper function to search skills
export const searchSkills = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return skillsData
    .map(category => ({
      category: category.category,
      skills: category.skills.filter(skill => 
        skill.toLowerCase().includes(term)
      )
    }))
    .filter(category => category.skills.length > 0);
};

