import fs from "fs";

interface LoseObject {
    [key : string] : any
}

export function TruncateHistory(messages : Array<any>, max : number){
    return messages.slice(Math.max(messages.length - max, 1));
}

export function LoadAdataJson(path : string) : LoseObject[]{

    try {

        const rowSplitter = "-|-"
        const columnSplitter = "-;-"

        const data = fs.readFileSync(path).toString();
        const dataLines = data.split(columnSplitter);


        if (dataLines.length == 0){
            return [];
        }

        const header = dataLines[0].split(rowSplitter);
        const headerSize = header.length;

        const list : LoseObject[] = [];
        let  index = 0;

        dataLines.forEach((element) => {
            
            if (index == 0){
                index++;
                return;
            }
            
            const rows = element.split(rowSplitter);
            const rowsSize = rows.length;

            let rowIndex = 0;

            if (rowsSize != headerSize)
                return { error : `Element of index ${index} has invalid row size ${rowsSize} instead of ${headerSize}`};
            

            const newObj :LoseObject = {}
            
            rows.forEach((element) => {

                const rowHeader = header[rowIndex].trim();
                const rowValue = element.trim();

                newObj[rowHeader] = rowValue;
                rowIndex ++;
            })

            list.push(newObj);

            index++;

        });

        return list;

    }
    catch (error) {
        throw error;
    }
}


export function appendAdata(path : string, data : string[]){

    let dataString = "";

    const last = data.length -1;
    let index = 0;

    data.forEach(element => {
        if (index != last)
            dataString += element + "-|-"
        else 
            dataString += element + "-;-"

        index++;
    });

    dataString += "\n";

    fs.appendFileSync(path, dataString);
}

