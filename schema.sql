-- Smart University Management System (SUMS) - Database Schema
-- Storage Engine: InnoDB (for ACID compliance)

DROP DATABASE IF EXISTS SmartUniversityDB;
CREATE DATABASE SmartUniversityDB;
USE SmartUniversityDB;

-- 1. Departments Table
CREATE TABLE Departments (
    DeptID INT AUTO_INCREMENT PRIMARY KEY,
    DeptName VARCHAR(100) NOT NULL UNIQUE,
    Building VARCHAR(50) DEFAULT 'Main Campus',
    Budget DECIMAL(12, 2) DEFAULT 0.00
) ENGINE=InnoDB;

-- 2. Faculty Table
CREATE TABLE Faculty (
    FacultyID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    HireDate DATE NOT NULL,
    DeptID INT,
    FacultyRank ENUM('Assistant Professor', 'Associate Professor', 'Professor', 'Lecturer') DEFAULT 'Lecturer',
    FOREIGN KEY (DeptID) REFERENCES Departments(DeptID) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. Students Table
CREATE TABLE Students (
    StudentID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    EnrollmentDate DATE DEFAULT (CURRENT_DATE),
    DOB DATE NOT NULL,
    DeptID INT,
    FOREIGN KEY (DeptID) REFERENCES Departments(DeptID) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. Courses Table
CREATE TABLE Courses (
    CourseID VARCHAR(10) PRIMARY KEY,
    CourseTitle VARCHAR(150) NOT NULL,
    Credits INT CHECK (Credits > 0 AND Credits <= 10),
    DeptID INT,
    FOREIGN KEY (DeptID) REFERENCES Departments(DeptID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Sections (Specific instances of courses)
CREATE TABLE Sections (
    SectionID INT AUTO_INCREMENT PRIMARY KEY,
    CourseID VARCHAR(10),
    FacultyID INT,
    Semester ENUM('Fall', 'Spring', 'Summer') NOT NULL,
    Year YEAR NOT NULL,
    RoomNumber VARCHAR(10),
    Capacity INT DEFAULT 30,
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID) ON DELETE CASCADE,
    FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. Enrollments (Many-to-Many Bridge Student <-> Section)
CREATE TABLE Enrollments (
    EnrollmentID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT,
    SectionID INT,
    Grade DECIMAL(3, 2), -- 0.00 to 4.00 (GPA scale)
    EnrollmentStatus ENUM('Enrolled', 'Withdrawn', 'Completed', 'Dropped') DEFAULT 'Enrolled',
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE,
    FOREIGN KEY (SectionID) REFERENCES Sections(SectionID) ON DELETE CASCADE,
    UNIQUE(StudentID, SectionID) -- Prevent duplicate enrollment
) ENGINE=InnoDB;

-- 7. Attendance Table
CREATE TABLE Attendance (
    AttendanceID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT,
    SectionID INT,
    Date DATE NOT NULL,
    Status ENUM('Present', 'Absent', 'Excused') DEFAULT 'Present',
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE,
    FOREIGN KEY (SectionID) REFERENCES Sections(SectionID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Payments Table
CREATE TABLE Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT,
    Amount DECIMAL(10, 2) NOT NULL,
    PaymentDate DATE DEFAULT (CURRENT_DATE),
    PaymentMethod ENUM('Credit Card', 'Bank Transfer', 'Scholarship', 'Cash') DEFAULT 'Bank Transfer',
    Status ENUM('Paid', 'Pending', 'Failed') DEFAULT 'Pending',
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE
) ENGINE=InnoDB;
