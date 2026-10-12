const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

class ServiceManager {
  constructor() {
    this.path = path.join(__dirname, '../data/services.json');
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
        throw new Error('El archivo de servicios debe contener un array');
      }

      return data;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('El archivo services.json contiene JSON inválido');
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

  getServices() {
    return this.readFile();
  }

  getServiceById(sid) {
    const services = this.readFile();

    return services.find(service => service.id === sid) || null;
  }

  addService(serviceData) {
    const services = this.readFile();

    const newService = {
      id: randomUUID(),
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      available: serviceData.available
    };

    services.push(newService);
    this.writeFile(services);

    return newService;
  }

  updateService(sid, updatedData) {
    const services = this.readFile();

    const index = services.findIndex(
      service => service.id === sid
    );

    if (index === -1) {
      return null;
    }

    // Se conserva el ID original y no se permiten
    // modificaciones del identificador.
    services[index] = {
      ...services[index],
      name: updatedData.name,
      description: updatedData.description,
      duration: updatedData.duration,
      price: updatedData.price,
      category: updatedData.category,
      available: updatedData.available
    };

    this.writeFile(services);

    return services[index];
  }

  deleteService(sid) {
    const services = this.readFile();

    const index = services.findIndex(
      service => service.id === sid
    );

    if (index === -1) {
      return null;
    }

    const deletedService = services[index];

    services.splice(index, 1);
    this.writeFile(services);

    return deletedService;
  }
}

module.exports = ServiceManager;