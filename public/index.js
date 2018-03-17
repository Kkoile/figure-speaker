Vue.component('search-result', {
    props: ['item'],
    template: '<div class="searchItem"><img v-if="item.images" class="albumCover" :src="item.images[1].url"/><div class="titleCover" v-else>{{ item.name }}</div><button v-if="item.type===\'artist\'" class="itemButton" v-on:click="openArtist">Open</button><button v-else class="itemButton" v-on:click="saveItem">Save</button></div>',
    methods: {
        openArtist: function () {
            Vue.http.get('./artist/' + this.item.id, function (oData) {

            })
                .error(function (err) {
                    alert(err);
                });
        },
        saveItem: function () {
            Vue.http.post('./settings/saveFigure', {streamUri: this.item.uri})
                .error(function (err) {
                    alert(err);
                });
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        query: "",
        artists: data.artists.items,
        albums: data.albums.items,
        tracks: data.tracks.items
    },
    methods: {
        search: function () {
            search(this.query).then(function (oData) {
                var data = oData.body;
                this.artists = data.artists.items;
                this.albums = data.albums.items;
                this.tracks = data.tracks.items;
            }.bind(this))
                .catch(function (err) {
                    alert(err);
                });
        }
    }
});