document.addEventListener('DOMContentLoaded', function () {
/* De Leon, Charles Jacob G, Barte, Aaron John M., Cosme, Jan Yvan G., Lucena, Rowvic Joshua C., Masiglat, Ivan Rudolf S., Taborda, Mico S  */
    const termsCheck = document.getElementById('termsCheck');
    const confirmBtn = document.getElementById('confirmBorrowBtn');
    const borrowDateInput = document.getElementById('borrowDate');
    const returnDateInput = document.getElementById('returnDate');
    const dateError = document.getElementById('dateError');
    const notification = document.getElementById('borrowNotification');
    const borrowForm = document.getElementById('borrowForm');
    const borrowModal = document.getElementById('borrowModal');

    termsCheck.addEventListener('change', function () {
        confirmBtn.disabled = !this.checked;
    });
/* De Leon, Charles Jacob G, Barte, Aaron John M., Cosme, Jan Yvan G., Lucena, Rowvic Joshua C., Masiglat, Ivan Rudolf S., Taborda, Mico S  */
    const today = new Date().toISOString().split('T')[0];
    borrowDateInput.setAttribute('min', today);
    returnDateInput.setAttribute('min', today);

    borrowDateInput.addEventListener('change', function () {
        const borrowVal = this.value;
        if (!borrowVal) return;

        const borrow = new Date(borrowVal);

        const defaultReturn = new Date(borrow);
        defaultReturn.setMonth(defaultReturn.getMonth() + 1);

        const maxReturn = new Date(borrow);
        maxReturn.setMonth(maxReturn.getMonth() + 2);
/* De Leon, Charles Jacob G, Barte, Aaron John M., Cosme, Jan Yvan G., Lucena, Rowvic Joshua C., Masiglat, Ivan Rudolf S., Taborda, Mico S  */
        const defaultStr = defaultReturn.toISOString().split('T')[0];
        const maxStr = maxReturn.toISOString().split('T')[0];

        returnDateInput.value = defaultStr;
        returnDateInput.setAttribute('max', maxStr);
        returnDateInput.setAttribute('min', borrowVal);

        returnDateInput.dispatchEvent(new Event('change'));
    });
/* De Leon, Charles Jacob G, Barte, Aaron John M., Cosme, Jan Yvan G., Lucena, Rowvic Joshua C., Masiglat, Ivan Rudolf S., Taborda, Mico S  */
    returnDateInput.addEventListener('change', function () {
        const borrowVal = borrowDateInput.value;
        const returnVal = this.value;

        if (!borrowVal || !returnVal) return;

        const borrow = new Date(borrowVal);
        const ret = new Date(returnVal);
        const diffDays = Math.ceil((ret - borrow) / (1000 * 60 * 60 * 24));
/* De Leon, Charles Jacob G, Barte, Aaron John M., Cosme, Jan Yvan G., Lucena, Rowvic Joshua C., Masiglat, Ivan Rudolf S., Taborda, Mico S  */
        if (ret < borrow) {
            dateError.textContent = "Return date cannot be earlier than the borrow date.";
            dateError.style.display = 'block';
        } else if (diffDays > 61) {
            dateError.textContent = "Return date cannot exceed 2 months from the borrow date.";
            dateError.style.display = 'block';
        } else {
            dateError.style.display = 'none';
        }
    });
/* De Leon, Charles Jacob G, Barte, Aaron John M., Cosme, Jan Yvan G., Lucena, Rowvic Joshua C., Masiglat, Ivan Rudolf S., Taborda, Mico S  */
    confirmBtn.addEventListener('click', function () {
        if (!borrowDateInput.value || !returnDateInput.value) {
            alert("Please select both dates.");
            return;
        }
        if (!termsCheck.checked) {
            alert("Please agree to the terms.");
            return;
        }
        if (dateError.style.display === 'block') {
            alert("Please fix the date errors.");
            return;
        }
/* De Leon, Charles Jacob G, Barte, Aaron John M., Cosme, Jan Yvan G., Lucena, Rowvic Joshua C., Masiglat, Ivan Rudolf S., Taborda, Mico S  */
        notification.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });

        borrowForm.reset();
        confirmBtn.disabled = true;
        dateError.style.display = 'none';

        const modalInstance = bootstrap.Modal.getInstance(borrowModal);
        modalInstance.hide();
    });

});
/* De Leon, Charles Jacob G, Barte, Aaron John M., Cosme, Jan Yvan G., Lucena, Rowvic Joshua C., Masiglat, Ivan Rudolf S., Taborda, Mico S  */
const API_URL = 'http://localhost/library/';
let selectedBookId = null;

async function loadUserBooks() {
    try {
        const res = await fetch(API_URL + 'get_books.php');
        const books = await res.json();

        document.querySelectorAll(".tab-pane tbody").forEach(tbody => tbody.innerHTML = "");

        books.forEach(book => {
            if (book.is_hidden == 1) return; 

            const pane = document.getElementById(book.genre_id);
            if (pane) {
                const tbody = pane.querySelector("tbody");
                const tr = document.createElement("tr");

                const statusTag = book.status.toLowerCase().replace(/\s+/g, "");
                const statusBadge = `<span class='book-status book-status-${statusTag}'>${book.status}</span>`;

                let actionHtml = "";
                if (book.status === "Available") {
                    actionHtml = `<button class="btn btn-sm btn-success borrow-btn" data-id="${book.id}" data-bs-toggle="modal" data-bs-target="#borrowModal"><i class="bi bi-book"></i> Borrow</button>`;
                }

                tr.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.year}</td>
                    <td>${statusBadge}</td>
                    <td>${book.call_no}</td>
                    <td class="text-center">${actionHtml}</td>
                `;
                tbody.appendChild(tr);
            }
        });

        document.querySelectorAll('.borrow-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                selectedBookId = this.getAttribute('data-id');
            });
        });

    } catch (err) {
        console.error(err);
    }
}

loadUserBooks();

document.getElementById('confirmBorrowBtn').addEventListener('click', async function () {
    const borrowDateInput = document.getElementById('borrowDate');
    const returnDateInput = document.getElementById('returnDate');
    const termsCheck = document.getElementById('termsCheck');
    const dateError = document.getElementById('dateError');

    if (!borrowDateInput.value || !returnDateInput.value || !termsCheck.checked || dateError.style.display === 'block') {
        return; 
    }

    if (selectedBookId) {
        try {
            await fetch(API_URL + 'borrow_book.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    book_id: selectedBookId,
                    borrow_date: borrowDateInput.value,
                    return_date: returnDateInput.value
                })
            });
            
            loadUserBooks(); 
        } catch (err) {
            console.error(err);
        }
    }
});
/* De Leon, Charles Jacob G, Barte, Aaron John M., Cosme, Jan Yvan G., Lucena, Rowvic Joshua C., Masiglat, Ivan Rudolf S., Taborda, Mico S  */
