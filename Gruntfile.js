
'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    responsive_images: {
      options: {
        engine: "gm"
    },
    "resize_cards": {
        options: {
            sizes: [{
                name: "small",
                width: 200
            },{
                name: "large",
                width: 400
            }]
        },
        files: [{
            expand: true,
            src: ['**.{jpg,gif,png}'],
            cwd: 'img/cards/',
            dest: 'img/cards/sizes/'
        }
        ]
    },
    "resize_stills": {
        options: {
            sizes: [
            {
                name: "small",
                width: 350
            },
            {
                name: "medium",
                width: 700
            },
            {
                name: "large",
                width: 1400
            }]
        },
        files:[ {
            expand: true,
            src: ['**.{jpg,gif,png}'],
            cwd: 'img/stills/',
            dest: 'img/stills/sizes/'
        }
        ]
    }
}
});

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-responsive-images');

  // Default task.
  grunt.registerTask('default', ['responsive_images']);

};