let idx = 1;
export const data = {
    color: "white",
    theme: "light",
    colors: ["white", "green", "red"],
    themes: ["light", "dark"],
    levels: [
      {title:"level 1",sublevels:[{title: "sublevel 1", levels:[{title: "sub sub level 1"}]}]}
    ],
    posts: [
      {
        id: 1,
        title: "post 1",
        content: "Lorem ipsum dolor sit amet, consectetur adip",
        photos: [
          {
            id: 1,
            title: "photo 1",
            url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg",
            comments: [
              {
                id: 1,
                user: {
                  id: 1,
                  name: "user 1",
                },
                content:
                  "Lorem ipsum dolor sit amet, consectetur adip i consequat dolore magna aliquet erat.",
              },
            ],
          },
          {
            id: 2,
            title: "photo 2",
            url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg",
            comments: [
              {
                id: 2,
                user: {
                  id: 1,
                  name: "user 1",
                },
                content:
                  "Lorem ipsum dolor sit amet, consectetur adip i consequat dolore magna aliquet erat.",
              },
            ],
          },

        ],
      },
      {
        id: 1,
        title: "post 1",
        content: "Lorem ipsum dolor sit amet, consectetur adip",
        photos: [
          {
            id: 1,
            title: "photo 1",
            url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg",
            comments: [
              {
                id: 1,
                user: {
                  id: 1,
                  name: "user 1",
                },
                content:
                  "Lorem ipsum dolor sit amet, consectetur adip i consequat dolore magna aliquet erat.",
              },
            ],
          },
          {
            id: 2,
            title: "photo 2",
            url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg",
            comments: [
              {
                id: 2,
                user: {
                  id: 1,
                  name: "user 1",
                },
                content:
                  "Lorem ipsum dolor sit amet, consectetur adip i consequat dolore magna aliquet erat.",
              },
            ],
          },

        ],
      },
      {
        id: 1,
        title: "post 1",
        content: "Lorem ipsum dolor sit amet, consectetur adip",
        photos: [
          {
            id: 1,
            title: "photo 1",
            url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg",
            comments: [
              {
                id: 1,
                user: {
                  id: 1,
                  name: "user 1",
                },
                content:
                  "Lorem ipsum dolor sit amet, consectetur adip i consequat dolore magna aliquet erat.",
              },
            ],
          },
          {
            id: 2,
            title: "photo 2",
            url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg",
            comments: [
              {
                id: 2,
                user: {
                  id: 1,
                  name: "user 1",
                },
                content:
                  "Lorem ipsum dolor sit amet, consectetur adip i consequat dolore magna aliquet erat.",
              },
            ],
          },

        ],
      },
      {
        id: 1,
        title: "post 1",
        content: "Lorem ipsum dolor sit amet, consectetur adip",
        photos: [
          {
            id: 1,
            title: "photo 1",
            url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg",
            comments: [
              {
                id: 1,
                user: {
                  id: 1,
                  name: "user 1",
                },
                content:
                  "Lorem ipsum dolor sit amet, consectetur adip i consequat dolore magna aliquet erat.",
              },
            ],
          },
          {
            id: 2,
            title: "photo 2",
            url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg",
            comments: [
              {
                id: 2,
                user: {
                  id: 1,
                  name: "user 1",
                },
                content:
                  "Lorem ipsum dolor sit amet, consectetur adip i consequat dolore magna aliquet erat.",
              },
            ],
          },
      
        ],
      },
    ].map((el,i)=> {
        el.id = i;
        el.title= "post "+i,
        el.photos = el.photos.map(p => {
            idx++;
            p.url = "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-"+idx+".jpg"
            return p;
        })
        return el
    })
}