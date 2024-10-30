SELECT a.leavebalance, 
               COALESCE(SUM(lr.totaldays), 0) AS days_used
        FROM employee a
        LEFT JOIN leaverequests lr ON a.employeeid = lr.employeeid 
        AND lr.status = 'approved' -- เฉพาะใบลาที่อนุมัติแล้ว
        WHERE a.employeeid = 1
        GROUP BY a.employeeid;