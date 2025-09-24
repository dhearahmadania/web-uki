// Singleton Pattern for CourseManager
class CourseManager {
    constructor() {
        if (!CourseManager.instance) {
            this.courses = [
                // Mengubah paket makanan menjadi paket kursus stir mobil
                new Course('Paket Manual Sigra', 400000, './assets/images/manual-sigra.png'),
                new Course('Paket Matic Ayla', 500000, './assets/images/matic-ayla.png'),
                new Course('Paket Mix (Manual + Matic)', 550000, './assets/images/paket-mix.png'),
                new Course('Per Jam (Manual)', 100000, './assets/images/per-jam-manual.png'),
                new Course('Per Jam (Matic)', 120000, './assets/images/per-jam-matic.png')
            ];
            CourseManager.instance = this;
        }
        return CourseManager.instance;
    }

    getCourses() {
        return this.courses;
    }
}

class Course {
    constructor(name, price, image) {
        this.name = name;
        this.price = price;
        this.image = image;
    }
}

// Observer Pattern for Cart and UIHandler
class Cart {
    constructor() {
        this.items = [];
        this.totalHarga = 0;
        this.subscribers = [];
    }

    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }

    notify() {
        this.subscribers.forEach(subscriber => subscriber.update());
    }

    // Kode ini sekarang mengizinkan penambahan paket yang sama lebih dari satu kali
    addItem(course) {
        const item = this.items.find(i => i.course.name === course.name);
        if (item) {
            item.quantity++;
        } else {
            this.items.push(new CartItem(course, 1));
        }
        this.totalHarga += course.price;
        this.notify();
    }

    // Perbaikan: Mengubah logika agar removeItem menghapus item sepenuhnya
    removeItem(index) {
        const item = this.items[index];
        this.totalHarga -= (item.course.price * item.quantity);
        this.items.splice(index, 1);
        this.notify();
    }

    clearCart() {
        this.items = [];
        this.totalHarga = 0;
        this.notify();
    }

    getItems() {
        return this.items;
    }

    getTotalHarga() {
        return this.totalHarga;
    }
}

class CartItem {
    constructor(course, quantity) {
        this.course = course;
        this.quantity = quantity;
    }
}

// UIHandler as a Subscriber
class UIHandler {
    constructor(cart, courseManager) {
        this.cart = cart;
        this.courseManager = courseManager;
        this.cart.subscribe(this);
    }

    update() {
        this.generateData();
    }

    generateData() {
        const courseList = document.getElementById('courseList');
        const cartList = document.getElementById('cartList');
        courseList.innerHTML = '';
        cartList.innerHTML = '';

        this.courseManager.getCourses().forEach((course, index) => {
            courseList.appendChild(this.createCourseCard(course, index));
        });

        cartList.appendChild(this.createCartTotal());
        
        this.cart.getItems().forEach((item, index) => {
            cartList.appendChild(this.createCartItem(item, index));
        });

        cartList.appendChild(this.createOrderForm());

        cartList.style.display = this.cart.getItems().length ? 'block' : 'none';
    }

    createCourseCard(course, index) {
        let divCard = document.createElement('div');
        divCard.classList.add('card');

        let imageData = document.createElement('img');
        imageData.setAttribute("src", course.image);
        divCard.appendChild(imageData);

        let title = document.createElement('p');
        title.innerHTML = course.name;
        divCard.appendChild(title);

        let hr = document.createElement('hr');
        divCard.appendChild(hr);

        let divAction = document.createElement('div');
        divAction.classList.add('action');

        let spanData = document.createElement('span');
        spanData.innerHTML = `Rp ${UIHandler.toRupiah(course.price)},00`;
        divAction.appendChild(spanData);

        let buttonAdd = document.createElement('button');
        buttonAdd.innerHTML = '<i class="fas fa-car"></i> Daftar';
        buttonAdd.onclick = () => this.addToCart(index);
        divAction.appendChild(buttonAdd);

        divCard.appendChild(divAction);

        return divCard;
    }

    createCartTotal() {
        let totalDiv = document.createElement('div');
        totalDiv.classList.add('total-container');

        let totalLabel = document.createElement('p');
        totalLabel.classList.add('total-label');
        totalLabel.innerHTML = 'TOTAL :';
        totalDiv.appendChild(totalLabel);

        let totalh1 = document.createElement('h1');
        totalh1.classList.add('total-price');
        totalh1.innerHTML = `Rp${UIHandler.toRupiah(this.cart.getTotalHarga())},00`;
        totalDiv.appendChild(totalh1);

        return totalDiv;
    }

    createCartItem(item, index) {
        let divCardx = document.createElement('div');
        divCardx.classList.add('card-order');

        let divCardDetail = document.createElement('div');
        divCardDetail.classList.add('detail');

        let imageData = document.createElement('img');
        imageData.setAttribute("src", item.course.image);
        divCardDetail.appendChild(imageData);

        let courseName = document.createElement('p');
        courseName.innerHTML = item.course.name;
        divCardDetail.appendChild(courseName);

        let courseJumlah = document.createElement('span');
        courseJumlah.innerHTML = item.quantity;
        divCardDetail.appendChild(courseJumlah);

        divCardx.appendChild(divCardDetail);

        let buttonCancel = document.createElement('button');
        buttonCancel.setAttribute('value', index);
        buttonCancel.onclick = () => this.removeFromCart(index);
        buttonCancel.innerHTML = '<i class="fas fa-trash"></i> Batalkan';
        divCardx.appendChild(buttonCancel);

        return divCardx;
    }

    createOrderForm() {
        let formDiv = document.createElement('div');
        formDiv.classList.add("card-finish");
        
        let labelName = document.createElement('label');
        labelName.setAttribute('for', 'customerName');
        labelName.innerText = 'Nama Anda';
        formDiv.appendChild(labelName);
        
        let inputName = document.createElement('input');
        inputName.setAttribute('type', 'text');
        inputName.setAttribute('id', 'customerName');
        inputName.setAttribute('placeholder', 'Masukkan nama Anda');
        formDiv.appendChild(inputName);
        
        let labelLocation = document.createElement('label');
        labelLocation.setAttribute('for', 'location');
        labelLocation.innerText = 'Lokasi Kursus';
        formDiv.appendChild(labelLocation);
        
        let inputLocation = document.createElement('input');
        inputLocation.setAttribute('type', 'text');
        inputLocation.setAttribute('id', 'location');
        inputLocation.setAttribute('placeholder', 'Contoh: Pleburan / Banyumanik');
        formDiv.appendChild(inputLocation);
        
        let labelPayment = document.createElement('label');
        labelPayment.setAttribute('for', 'paymentMethod');
        labelPayment.innerText = 'Metode Pembayaran';
        formDiv.appendChild(labelPayment);
        
        let inputPayment = document.createElement('input');
        inputPayment.setAttribute('type', 'text');
        inputPayment.setAttribute('id', 'paymentMethod');
        inputPayment.setAttribute('placeholder', 'Contoh: Tunai / Transfer Bank');
        formDiv.appendChild(inputPayment);
        
        let buttonOrder = document.createElement('button');
        buttonOrder.onclick = () => this.orderCourse();
        buttonOrder.innerHTML = 'DAFTAR SEKARANG';
        buttonOrder.classList.add('submit-button');
        formDiv.appendChild(buttonOrder);
        
        return formDiv;
    }

    addToCart(index) {
        const course = this.courseManager.getCourses()[index];
        this.cart.addItem(course);
    }

    removeFromCart(index) {
        this.cart.removeItem(index);
    }

    orderCourse() {
        const customerName = document.getElementById('customerName').value.trim();
        const location = document.getElementById('location').value.trim();
        const paymentMethod = document.getElementById('paymentMethod').value.trim();
        
        if (!customerName || !location || !paymentMethod) {
            alert('Nama, lokasi kursus, dan metode pembayaran harus diisi.');
            return; 
        }
        
        if (paymentMethod.toLowerCase().includes('transfer')) {
            this.showTransferNotification();
        }
        
        const orderMessage = this.generateOrderMessage(customerName, location, paymentMethod);
        const encodedMessage = encodeURIComponent(orderMessage);
        const whatsappURL = `https://wa.me/6282312680720?text=${encodedMessage}`;
        
        if (confirm("Anda akan diarahkan ke WhatsApp untuk mengirim pendaftaran. Lanjutkan?")) {
            const newWindow = window.open(whatsappURL, "_blank");
            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                alert("Gagal membuka WhatsApp. Pastikan WhatsApp terinstal atau salin pesan berikut untuk mengirim manual:\n\n" + decodeURIComponent(encodedMessage));
            } else {
                alert("Pendaftaran telah diterima, Mohon menunggu.");
                this.cart.clearCart();
            }
        }
    }
    
    showTransferNotification() {
        const popup = document.getElementById('custom-popup');
        popup.style.display = 'block';

        const span = document.getElementsByClassName("close-button")[0];
        span.onclick = () => {
            popup.style.display = "none";
        };

        window.onclick = (event) => {
            if (event.target == popup) {
                popup.style.display = "none";
            }
        };
    }
    
    generateOrderMessage(customerName, location, paymentMethod) {
        let orderMessage = `*Halo UKI Kursus Stir Mobil, saya mau daftar kursus.*\n\n`;
        orderMessage += `*Nama Lengkap: ${customerName}*\n`;
        orderMessage += `*Lokasi Kursus: ${location}*\n`;
        orderMessage += `*Metode Pembayaran: ${paymentMethod}*\n\n`;
        orderMessage += `*Pilihan Paket:*\n`;
        
        this.cart.getItems().forEach(item => {
            let packageDetails = '';
            if (item.course.name.includes('Paket Manual Sigra')) {
                packageDetails = ' (5 jam, bisa kelipatan)';
            } else if (item.course.name.includes('Paket Matic Ayla')) {
                packageDetails = ' (5 jam, bisa kelipatan)';
            } else if (item.course.name.includes('Paket Mix')) {
                packageDetails = ' (3x manual + 2x matic)';
            } else if (item.course.name.includes('Per Jam')) {
                packageDetails = ` (total ${item.quantity} jam)`;
            }
            orderMessage += `• ${item.course.name}${packageDetails} x ${item.quantity}\n`;
        });
        orderMessage += `\n*Total Tagihan: Rp${UIHandler.toRupiah(this.cart.getTotalHarga())},00*\n\n`;
        
        orderMessage += `Mohon konfirmasi ketersediaan jadwal dan waktu yang fleksibel ya. Terima kasih!`;
        return orderMessage;
    }
    
    static toRupiah(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
}

const cart = new Cart();
const courseManager = new CourseManager();
const uiHandler = new UIHandler(cart, courseManager);
uiHandler.generateData();