import House from './house';

interface IMdr {
    houses: House[];
    add(a: any): void;
}

export default class Mdr implements IMdr {
    houses: House[];
    fileName = 'data/mdr.json';

    constructor(data?: any) {
        this.houses = [];
        if (data !== undefined) {
            this.parse(data);
        }
    }

    add(d: any): void {
        switch (d.constructor.name) {
            case 'House':
                this.houses.push(d);
                break;
            default:
                break;
        }
    }

    parse(data: any): void {
        let dataAsJson;
        if (typeof data === 'string') {
            try {
                dataAsJson = JSON.parse(data);
            } catch (ex) {
                return ex;
            }
        } else {
            dataAsJson = data;
        }
        for (const houseName in dataAsJson) {
            if (houseName === 'Special') {
                continue; // Unassigned members w/o a division
            }
            const houseObject = new House(dataAsJson[houseName]);
            this.add(houseObject);
        }
    }
}
