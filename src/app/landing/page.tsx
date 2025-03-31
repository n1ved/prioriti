'use client';
import React, { useState } from 'react';
import styles from './page.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function LandingPage() {
  const [documents, setDocuments] = useState<File[]>([]);
  const [specialPreference, setSpecialPreference] = useState('');
  const [weekdaysHours, setWeekdaysHours] = useState('');
  const [weekendsHours, setWeekendsHours] = useState('');
  const [semesterStartDate, setSemesterStartDate] = useState<Date | null>(null);
  const [semesterEndDate, setSemesterEndDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const pdfFiles = newFiles.filter(file => file.type === 'application/pdf');
      
      if (pdfFiles.length !== newFiles.length) {
        setMessage({ text: 'Only PDF files are allowed.', type: 'error' });
        // Auto-hide message after 3 seconds
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        return;
      }
      
      setDocuments(prev => [...prev, ...pdfFiles]);
      setMessage({ text: 'Files uploaded successfully.', type: 'success' });
      // Auto-hide message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (documents.length === 0) {
      setMessage({ text: 'Please upload at least one document.', type: 'error' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage({ text: 'Documents submitted successfully!', type: 'success' });
      setDocuments([]);
      setSpecialPreference('');
      setWeekdaysHours('');
      setWeekendsHours('');
      setSemesterStartDate(null);
      setSemesterEndDate(null);
    } catch (error) {
      setMessage({ text: 'Error submitting documents. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <h1>prioriti</h1>
      </nav>

      {/* Notification displayed outside of the form/container flow */}
      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.container}>
        <section className={styles.upload_container}>
          <h2>Get Started</h2>
          <div className={styles.upload_card}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.uploadArea}>
                <input
                  type="file"
                  id="documentUpload"
                  onChange={handleFileUpload}
                  accept=".pdf"
                  multiple
                  className={styles.fileInput}
                />
                <label htmlFor="documentUpload" className={styles.uploadButton}>
                  Select PDFs to Upload
                </label>
              </div>

              {documents.length > 0 && (
                <div className={styles.documentList}>
                  <h3>Uploaded Documents:</h3>
                  <ul>
                    {documents.map((doc, index) => (
                      <li key={index} className={styles.documentItem}>
                        <span>{doc.name}</span>
                        <button 
                          type="button" 
                          onClick={() => removeDocument(index)}
                          className={styles.removeButton}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.timingSection}>
                <h3>Study Hours</h3>
                <div className={styles.timingInputs}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="weekdaysHours">Weekdays</label>
                    <input
                      id="weekdaysHours"
                      type="number"
                      min="0"
                      max="24"
                      value={weekdaysHours}
                      onChange={(e) => setWeekdaysHours(e.target.value)}
                      placeholder="Hours per day"
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="weekendsHours">Weekends</label>
                    <input
                      id="weekendsHours"
                      type="number"
                      min="0"
                      max="24"
                      value={weekendsHours}
                      onChange={(e) => setWeekendsHours(e.target.value)}
                      placeholder="Hours per day"
                      className={styles.inputField}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.semesterSection}>
                <h3>Semester Duration</h3>
                <div className={styles.datePickerContainer}>
                  <div className={styles.datePickerWrapper}>
                    <label>Start Date</label>
                    <DatePicker
                      selected={semesterStartDate}
                      onChange={(date) => setSemesterStartDate(date)}
                      selectsStart
                      startDate={semesterStartDate}
                      endDate={semesterEndDate}
                      placeholderText="Select start date"
                      className={styles.datePicker}
                      dateFormat="MMM dd, yyyy"
                    />
                  </div>
                  <div className={styles.datePickerWrapper}>
                    <label>End Date</label>
                    <DatePicker
                      selected={semesterEndDate}
                      onChange={(date) => setSemesterEndDate(date)}
                      selectsEnd
                      startDate={semesterStartDate}
                      endDate={semesterEndDate}
                      minDate={semesterStartDate}
                      placeholderText="Select end date"
                      className={styles.datePicker}
                      dateFormat="MMM d, yyyy"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.preferences}>
                <h3>Special Preferences</h3>
                <textarea
                  value={specialPreference}
                  onChange={(e) => setSpecialPreference(e.target.value)}
                  className={styles.textArea}
                  placeholder="Enter your special preferences or additional requirements here..."
                  rows={5}
                />
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Documents'}
              </button>
            </form>
          </div>
        </section>
        
        <section className={styles.info_container}>
          <h2>How It Works</h2>
          <div className={styles.info_card}>
            <>
              <li>Upload your PDF documents</li>
              <li>Set your available study hours</li>
              <li>Specify your semester duration</li>
              <li>Add any special preferences or requirements</li>
              <li>Submit your documents for processing</li>
              <li>We'll organize and prioritize your tasks</li>
            </>
          </div>
        </section>
      </div>
    </main>
  );
}

