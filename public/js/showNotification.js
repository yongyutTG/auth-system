function showNotification(message) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");

    // ตั้งค่าข้อความแจ้งเตือน
    notificationMessage.textContent = message;
    
    // แสดงแจ้งเตือน
    notification.style.display = 'block';
    
    // ซ่อนแจ้งเตือนอัตโนมัติหลังจาก 3 วินาที
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function closeNotification() {
    document.getElementById("notification").style.display = 'none';
}

// ตัวอย่างการเรียกใช้งาน
// showNotification("เพิ่มขนมปังถังยาชานมลงตะกร้าแล้ว");