const { ID_LISTS } = require('./config');

module.exports = {
    getLists: function () {
        let idList = [];
        ID_LISTS.forEach(element => {
            idList.push(JSON.stringify({
                name: element.name,
                value: element.id
            }));
        });
        return JSON.parse(`[${idList.join(',')}]`);
    }
}