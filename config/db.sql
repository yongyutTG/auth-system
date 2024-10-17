-- Active: 1725641274728@@127.0.0.1@3306@employee_leave_system

-- ตารางพนักงาน 
CREATE TABLE Employee ( EmployeeID INT PRIMARY KEY AUTO_INCREMENT, FirstName VARCHAR(50), LastName VARCHAR(50), Position VARCHAR(50), Department VARCHAR(50), StartDate DATE, AnnualLeaveBalance INT );
 -- ตารางการลา 
 CREATE TABLE LeaveRequests ( LeaveRequestID INT PRIMARY KEY AUTO_INCREMENT, EmployeeID INT, LeaveType VARCHAR(50), StartDate DATE, EndDate DATE, TotalDays INT, Status VARCHAR(20), RequestDate DATE, FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID) ); 
 -- ตารางประเภทการลา 
 CREATE TABLE LeaveTypes ( LeaveTypeID INT PRIMARY KEY AUTO_INCREMENT, LeaveTypeName VARCHAR(50), Description TEXT );
  -- ตารางการอนุมัติ 
  CREATE TABLE ApprovalHistory ( ApprovalID INT PRIMARY KEY AUTO_INCREMENT, LeaveRequestID INT, ApprovedBy VARCHAR(50), ApprovalDate DATE, Comments TEXT, FOREIGN KEY (LeaveRequestID) REFERENCES LeaveRequests(LeaveRequestID) );