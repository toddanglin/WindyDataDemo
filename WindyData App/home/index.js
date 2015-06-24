'use strict';

app.home = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var dataProvider = app.data.defaultProvider,
        dataSourceOptions = {
            type: 'everlive',
            transport: {
                typeName: 'NwEmployees',
                dataProvider: dataProvider
            },
            group: {
                field: 'Country'
            },
            schema: {
                model: {
                    fields: {
                        'LastName': {
                            field: 'LastName',
                            defaultValue: ''
                        },
                        'Title': {
                            field: 'Title',
                            defaultValue: ''
                        },
                    }
                }
            },
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        homeModel = kendo.observable({
            dataSource: dataSource,
            itemClick: function(e) {
                app.mobileApp.navigate('#home/details.html?uid=' + e.dataItem.uid);
            },
            detailsShow: function(e) {
                var item = e.view.params.uid,
                    itemModel = dataSource.getByUid(item);
                homeModel.set('currentItem', itemModel);
            },
            currentItem: null
        });

    parent.set('homeModel', homeModel);
})(app.home);