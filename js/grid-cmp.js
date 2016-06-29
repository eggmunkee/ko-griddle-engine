var GridVM = function(params) {
    var self = this;

    // If there is a reference observable parameter, assign self to it
    if (params.reference)
        params.reference(self);

    self.rows = ko.observableArray([]);
    self.cellType = ko.observable(params.cellType || 'grid-cell-tmpl');
    self.selectedTile = ko.observable('');
    self.zoom = ko.observable(1.0);
    self.appendRow = function(cellList) {
        self.rows.push({
            cells: ko.observableArray(cellList)
        });
    };

    self.getGridData = function() {
        var rowData = ko.toJS(engine.gridComponent().rows);
        for (var i = 0; i < rowData.length; i++) {
            var row = rowData[i];

            var cells = row.cells;
            rowData[i] = cells;
        }
        return rowData;
    };
    self.setGridData = function(data) {
        self.rows([]); // clear rows
        for (var i = 0; i < data.length; i++) {
            var row = { cells: ko.observableArray(data[i]) };

            self.rows.push(row);
        }
    };
    self.setCell = function(row, col, data) {
        if (row < 0 || self.rows().length <= row)
            return;
        var cellList = self.rows()[row].cells();
        if (col < 0 || cellList.length <= col)
            return;
        cellList[col] = data;
        self.rows()[row].cells(cellList); //update observable cell list
    };

    $(params.rows || []).each(function() {
        var cellList = this;
        self.appendRow(cellList);
    });

    self.tiles = ko.observableArray(params.tiles || [1,2,3,4,5,6,7,8,9,10,"DEFAULT"]);
    self.tileLookup = params.tileLookup || {
        "1": "media/hazy-tile-1.png",
        "2": "media/hazy-tile-2.png",
        "3": "media/hazy-tile-3.png",
        "4": "media/hazy-tile-4.png",
        "5": "media/hazy-tile-5.png",
        "6": "media/hazy-tile-6.png",
        "7": "media/hazy-tile-7.png",
        "8": "media/hazy-tile-8.png",
        "9": "media/hazy-tile-9.png",
        "10": "media/hazy-tile-10.png",
        "DEFAULT": "media/hazy-tile-empty.png"
    };

    // Return an image source based on cell data
    self.imageSource = function(cellData) {
        if (cellData in self.tileLookup)
            return self.tileLookup[cellData];
        return self.tileLookup["DEFAULT"];
    };

    self.clickCell = function(row, col) {
        self.setCell(koVal(row), koVal(col), self.selectedTile());
    };

    self.clickPaletteItem = function(item) {
        self.selectedTile(item);
    };

};

ko.components.register('grid-cmp', {
    viewModel: GridVM,
    template: { element: 'grid-tmpl' }
});
