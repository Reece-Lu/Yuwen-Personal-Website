import React from 'react';
import LinkedInIcon from '../../assets/linkedin.png';
import EmailIcon from '../../assets/email.png';
import GitHubIcon from '../../assets/github.png';
import CVIcon from '../../assets/cv.png';

const ContactInfo = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
            <a href="https://www.linkedin.com/in/yuwen-lu-b10818259" target="_blank" rel="noopener noreferrer" style={{ margin: '0 1rem' }}>
                <img src={LinkedInIcon} alt="LinkedIn" style={{ width: '1.25rem', height: '1.25rem' }} />
            </a>
            <a href="mailto:yuwenl@uvic.com" style={{ margin: '0 1rem' }}>
                <img src={EmailIcon} alt="Email" style={{ width: '1.25rem', height: '1.25rem' }} />
            </a>
            <a href="https://github.com/Reece-Lu" target="_blank" rel="noopener noreferrer" style={{ margin: '0 1rem' }}>
                <img src={GitHubIcon} alt="GitHub" style={{ width: '1.25rem', height: '1.25rem' }} />
            </a>
            <a href="/springapp/download-resume" download style={{ margin: '0 1rem' }}>
                <img src={CVIcon} alt="CV" style={{ width: '1.25rem', height: '1.25rem' }} />
            </a>
        </div>
    );
};

export default ContactInfo;
