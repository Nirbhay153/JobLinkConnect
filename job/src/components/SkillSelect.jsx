import React, { useState } from 'react';
import { skillsData } from '../data/skills';

function SkillSelect({ selectedSkills = [], onChange }) {
  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      onChange(selectedSkills.filter(s => s !== skill));
    } else {
      onChange([...selectedSkills, skill]);
    }
  };

  return (
    <div>
      {skillsData.map(category => (
        <div key={category.category} style={{ marginBottom: '12px' }}>
          <strong>{category.category}</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
            {category.skills.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '14px',
                  border: selectedSkills.includes(skill)
                    ? '2px solid #10b981'
                    : '1px solid #000z',
                  background: selectedSkills.includes(skill)
                    ? '#10b981  '
                    : '#black',
                  cursor: 'pointer'
                }}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkillSelect;
