-- Smart University Management System (SUMS) - Analytics & Automation
USE SmartUniversityDB;

-- 1. VIEW: Student Transcripts
-- Displays a clean view of all completed courses for each student
CREATE OR REPLACE VIEW StudentTranscripts AS
SELECT 
    s.StudentID,
    CONCAT(s.FirstName, ' ', s.LastName) AS StudentName,
    c.CourseID,
    c.CourseTitle,
    e.Grade,
    sec.Semester,
    sec.Year
FROM Students s
JOIN Enrollments e ON s.StudentID = e.StudentID
JOIN Sections sec ON e.SectionID = sec.SectionID
JOIN Courses c ON sec.CourseID = c.CourseID
WHERE e.EnrollmentStatus = 'Completed';

-- 2. VIEW: Faculty Workload
-- Shows how many sections each faculty member is teaching
CREATE OR REPLACE VIEW FacultyWorkload AS
SELECT 
    f.FacultyID,
    CONCAT(f.FirstName, ' ', f.LastName) AS FacultyName,
    d.DeptName,
    COUNT(s.SectionID) AS TotalSections
FROM Faculty f
LEFT JOIN Sections s ON f.FacultyID = s.FacultyID
JOIN Departments d ON f.DeptID = d.DeptID
GROUP BY f.FacultyID, d.DeptName;

-- 3. STORED PROCEDURE: Calculate Student GPA
-- Calculates the average grade for a specific student
DELIMITER //

CREATE PROCEDURE GetStudentGPA(IN stud_id INT, OUT gpa DECIMAL(3,2))
BEGIN
    SELECT AVG(Grade) INTO gpa
    FROM Enrollments
    WHERE StudentID = stud_id AND EnrollmentStatus = 'Completed';
    
    -- If no grades found, set to 0.00
    IF gpa IS NULL THEN
        SET gpa = 0.00;
    END IF;
END //

DELIMITER ;

-- 4. TRIGGER: Prevent Over-Enrollment
-- Prevents a student from enrolling in a section that is already at full capacity
DELIMITER //

CREATE TRIGGER BeforeEnrollmentInsert
BEFORE INSERT ON Enrollments
FOR EACH ROW
BEGIN
    DECLARE current_count INT;
    DECLARE max_cap INT;
    
    -- Get current enrollment count for the section
    SELECT COUNT(*) INTO current_count 
    FROM Enrollments 
    WHERE SectionID = NEW.SectionID AND EnrollmentStatus = 'Enrolled';
    
    -- Get capacity for the section
    SELECT Capacity INTO max_cap 
    FROM Sections 
    WHERE SectionID = NEW.SectionID;
    
    IF current_count >= max_cap THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error: This section is already at maximum capacity.';
    END IF;
END //

DELIMITER ;

-- 5. TRIGGER: Automated Payment Status
-- Automatically marks a student as 'Paid' if they have a scholarship (simulated logic)
DELIMITER //

CREATE TRIGGER AfterPaymentInsert
AFTER INSERT ON Payments
FOR EACH ROW
BEGIN
    IF NEW.PaymentMethod = 'Scholarship' THEN
        UPDATE Payments SET Status = 'Paid' WHERE PaymentID = NEW.PaymentID;
    END IF;
END //

DELIMITER ;

-- 6. VIEW: Overdue Books
-- Lists all students who haven't returned books past the due date
CREATE OR REPLACE VIEW OverdueBooks AS
SELECT 
    l.LoanID,
    s.StudentID,
    CONCAT(s.FirstName, ' ', s.LastName) AS StudentName,
    b.Title AS BookTitle,
    l.DueDate,
    DATEDIFF(CURRENT_DATE, l.DueDate) AS DaysOverdue
FROM LibraryLoans l
JOIN Students s ON l.StudentID = s.StudentID
JOIN Books b ON l.BookID = b.BookID
WHERE l.ReturnDate IS NULL AND l.DueDate < CURRENT_DATE;

-- 7. VIEW: Hostel Availability
-- Shows occupancy stats for all hostels
CREATE OR REPLACE VIEW HostelAvailability AS
SELECT 
    HostelName,
    GenderRestriction,
    Capacity,
    CurrentOccupancy,
    (Capacity - CurrentOccupancy) AS RoomsAvailable
FROM Hostels;

-- 8. TRIGGER: Manage Book Inventory (Issue)
DELIMITER //

CREATE TRIGGER BeforeBookLoan
BEFORE INSERT ON LibraryLoans
FOR EACH ROW
BEGIN
    DECLARE available INT;
    
    SELECT AvailableCopies INTO available 
    FROM Books 
    WHERE BookID = NEW.BookID;
    
    IF available <= 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error: No copies of this book are currently available.';
    ELSE
        UPDATE Books 
        SET AvailableCopies = AvailableCopies - 1 
        WHERE BookID = NEW.BookID;
    END IF;
END //

DELIMITER ;

-- 9. TRIGGER: Manage Book Inventory (Return)
DELIMITER //

CREATE TRIGGER AfterBookReturn
AFTER UPDATE ON LibraryLoans
FOR EACH ROW
BEGIN
    -- If the book was just returned (ReturnDate changed from NULL to a date)
    IF OLD.ReturnDate IS NULL AND NEW.ReturnDate IS NOT NULL THEN
        UPDATE Books 
        SET AvailableCopies = AvailableCopies + 1 
        WHERE BookID = NEW.BookID;
        
        -- Logic for Fine Calculation (e.g., $1 per day late)
        IF NEW.ReturnDate > NEW.DueDate THEN
            UPDATE LibraryLoans 
            SET FineAmount = DATEDIFF(NEW.ReturnDate, NEW.DueDate) * 1.00
            WHERE LoanID = NEW.LoanID;
        END IF;
    END IF;
END //

DELIMITER ;

-- 10. TRIGGER: Update Hostel Occupancy
DELIMITER //

CREATE TRIGGER AfterRoomAllocation
AFTER INSERT ON RoomAllocations
FOR EACH ROW
BEGIN
    UPDATE Hostels 
    SET CurrentOccupancy = CurrentOccupancy + 1 
    WHERE HostelID = NEW.HostelID;
END //

DELIMITER ;

-- 11. STORED PROCEDURE: Check Graduation Eligibility
-- Checks if a student is ready to graduate based on Credits, GPA, and Dues
DELIMITER //

CREATE PROCEDURE CheckGraduationEligibility(IN stud_id INT, OUT is_eligible BOOLEAN, OUT msg TEXT)
BEGIN
    DECLARE total_credits INT DEFAULT 0;
    DECLARE current_gpa DECIMAL(3,2) DEFAULT 0.00;
    DECLARE pending_dues INT DEFAULT 0;
    
    -- Calculate total credits from completed courses
    SELECT SUM(c.Credits) INTO total_credits
    FROM Enrollments e
    JOIN Sections s ON e.SectionID = s.SectionID
    JOIN Courses c ON s.CourseID = c.CourseID
    WHERE e.StudentID = stud_id AND e.EnrollmentStatus = 'Completed';
    
    -- Calculate GPA
    CALL GetStudentGPA(stud_id, current_gpa);
    
    -- Check for pending payments
    SELECT COUNT(*) INTO pending_dues
    FROM Payments
    WHERE StudentID = stud_id AND Status = 'Pending';
    
    -- Graduation Logic (Example: 10+ credits and 2.5+ GPA and 0 dues)
    IF total_credits >= 10 AND current_gpa >= 2.5 THEN
        IF pending_dues = 0 THEN
            SET is_eligible = TRUE;
            SET msg = 'Congratulations! Student is eligible for graduation.';
        ELSE
            SET is_eligible = FALSE;
            SET msg = 'Ineligible: Student has pending financial dues.';
        END IF;
    ELSE
        SET is_eligible = FALSE;
        SET msg = CONCAT('Ineligible: Req. 10 credits (Has ', total_credits, ') and 2.5 GPA (Has ', current_gpa, ').');
    END IF;
END //

DELIMITER ;

-- 12. TRIGGER: Urgent Maintenance Notification
-- Sends a system alert when an 'Urgent' repair is reported
DELIMITER //

CREATE TRIGGER AfterMaintenanceInsert
AFTER INSERT ON MaintenanceLogs
FOR EACH ROW
BEGIN
    IF NEW.Priority = 'Urgent' THEN
        INSERT INTO SystemNotifications (FacultyID, Message)
        SELECT FacultyID, CONCAT('URGENT: Maintenance required at ', NEW.Location, '. Issue: ', NEW.Description)
        FROM Faculty
        WHERE FacultyRank = 'Professor' AND DeptID = 1 -- Notify HOD/Professors in charge
        LIMIT 1;
    END IF;
END //

DELIMITER ;


