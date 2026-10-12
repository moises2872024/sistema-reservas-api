const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const ServiceManager = require('./ServiceManager');

class BookingManager {
  constructor() {
    this.path = path.join(__dirname, '../data/bookings.json');
    this.serviceManager = new ServiceManager();

    this.initializeFile();
  }

  initializeFile() {
    const directory = path.dirname(this.path);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, '[]', 'utf8');
    }
  }

  readFile() {
    try {
      const content = fs.readFileSync(this.path, 'utf8');
      const data = JSON.parse(content);

      if (!Array.isArray(data)) {
        throw new Error('El archivo de reservas debe contener un array');
      }

      return data;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('El archivo bookings.json contiene JSON inválido');
      }

      throw error;
    }
  }

  writeFile(data) {
    fs.writeFileSync(
      this.path,
      JSON.stringify(data, null, 2),
      'utf8'
    );
  }

  createBooking(bookingData) {
    const bookings = this.readFile();

    const newBooking = {
      id: randomUUID(),
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      date: bookingData.date,
      time: bookingData.time,
      status: bookingData.status || 'pending',
      services: []
    };

    bookings.push(newBooking);
    this.writeFile(bookings);

    return newBooking;
  }

  getBookingById(bid) {
    const bookings = this.readFile();

    return bookings.find(booking => booking.id === bid) || null;
  }

  addServiceToBooking(bid, sid) {
    const bookings = this.readFile();

    const bookingIndex = bookings.findIndex(
      booking => booking.id === bid
    );

    if (bookingIndex === -1) {
      return {
        error: 'BOOKING_NOT_FOUND'
      };
    }

    const service = this.serviceManager.getServiceById(sid);

    if (!service) {
      return {
        error: 'SERVICE_NOT_FOUND'
      };
    }

    if (!service.available) {
      return {
        error: 'SERVICE_NOT_AVAILABLE'
      };
    }

    const booking = bookings[bookingIndex];

    const existingService = booking.services.find(
      item => item.service === sid
    );

    if (existingService) {
      existingService.quantity += 1;
    } else {
      booking.services.push({
        service: sid,
        quantity: 1
      });
    }

    this.writeFile(bookings);

    return booking;
  }
}

module.exports = BookingManager;