export class JsonData {

    static postUserPlaylistJson = {
        name: 'Test playlist',
        type: 'PUBLIC',
        ownerId: 1
    };

    static validPostArtistJson = {
        type: "PERSON",
        startDate: {
            year: 2012,
            month: 5,
            day: 23
        },
        endDate: null,
        person: {
            firstName: "Test",
            lastName: "Test",
            stageName: "Test",
            birthday: "1965-05-05"
        },
        band: null
    }

    static invalidPostArtistJson = {
        type: "DOG",
        startDate: {
            year: 2012,
            month: 5,
            day: 23
        },
        endDate: null,
        person: {
            firstName: "Test",
            lastName: "pop",
            stageName: "Nelson Mondialu",
            birthday: "1965-05-05"
        },
        band: null
    }

    static postAlbumJson = {
        title: "Test",
        description: "Test",
        genre: "Test",
        releaseDate: "2015-05-05",
        label: "Test",
        artistId: 2,
        songIdList: []
    }

    static baseAlbumJson = {
        title: 'Automation',
        description: 'Automation test album',
        genre: 'Rock',
        releaseDate: '2015-05-05',
        label: 'Test Label',
        artistId: 2,
        songIdList: []
    };

    static postSongJson = {
        title: 'TestSongTitle',
        duration: '04:12',
        alternativeTitles: [
            {
                title: 'TestSongAltTitle',
                language: 'TestSongAltTitleLanguage'
            }
        ],
        artistIds: []
    };

    static updateSongJson = {
        title: 'TestSongTitleUpdated',
        duration: '04:28',
        alternativeTitles: [],
        artistIds: []
    };

    static postPlaylistJson = {
        name: 'Test Playlist API',
        type: 'PUBLIC',
        ownerId: 11
    };
}