import { useState, useEffect } from "react";
import styles from "./Admin.module.scss";

function AdminPanel() {
  const [status, setStatus] = useState("waking"); // waking | unauthorized | authorized | failed
  const [inquiries, setInquiries] = useState([]);

  const fetchInquiries = async (password) => {
    try {
      // Check password
      const checkResponse = await fetch(
        "https://backend-dyankoveood.onrender.com/check-admin-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      if (!checkResponse.ok) {
        alert("Грешна парола!");
        setStatus("unauthorized");
        return;
      }

      setStatus("authorized");

      const dataResponse = await fetch(
        "https://backend-dyankoveood.onrender.com/inquiries",
        {
          headers: { Authorization: `Bearer ${password}` },
        }
      );

      const data = await dataResponse.json();
      setInquiries(data.reverse());
    } catch (err) {
      console.error("Backend error:", err);
      alert("Грешка при зареждането. Моля опитайте след малко.");
      setStatus("failed");
    }
  };

  useEffect(() => {
    // Try pinging the backend first to "wake it up"
    const wakeUp = async () => {
      try {
        await fetch("https://backend-dyankoveood.onrender.com/ping"); // simple GET route
        const password = prompt("Въведете парола за достъп:");
        if (password) {
          fetchInquiries(password);
        } else {
          setStatus("unauthorized");
        }
      } catch {
        setStatus("failed");
      }
    };

    wakeUp();
  }, []);

  if (status === "waking")
    return <p>Стартиране на административния панел...</p>;
  if (status === "failed")
    return <p>Сървърът се събужда. Моля опитайте след няколко секунди.</p>;
  if (status === "unauthorized") return <p>Нямате достъп до тази страница.</p>;

  return (
    <div className={styles.adminPanel}>
      <h2>Всички запитвания</h2>
      {inquiries.length === 0 ? (
        <p>Няма получени запитвания.</p>
      ) : (
        <div className={styles.inquiriesList}>
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className={styles.inquiryCard}>
              <h3>Запитване от: {inquiry.name}</h3>
              <p>
                <strong>Телефон:</strong> {inquiry.phone}
              </p>
              <p>
                <strong>Имейл:</strong> {inquiry.email}
              </p>
              <p>
                <strong>Услуга:</strong> {translateService(inquiry.service)}
              </p>
              <p>
                <strong>Съобщение:</strong> {inquiry.message}
              </p>
              <p>
                <strong>Дата:</strong> {inquiry.date}
              </p>

              {inquiry.files?.length > 0 && (
                <div className={styles.filesSection}>
                  <strong>Качени снимки:</strong>
                  <div className={styles.filesGrid}>
                    {inquiry.files.map((file) => (
                      <a
                        key={file.fileName}
                        href={`https://backend-dyankoveood.onrender.com${file.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.fileLink}
                      >
                        <img
                          src={`https://backend-dyankoveood.onrender.com${file.url}`}
                          alt={file.originalName}
                          className={styles.thumbnail}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function translateService(serviceKey) {
  const serviceMap = {
    building: "Строителство",
    planning: "Проектиране",
    geodesy: "Геодезия",
    others: "Друго",
  };
  return serviceMap[serviceKey] || "Неизвестна услуга";
}

export default AdminPanel;
