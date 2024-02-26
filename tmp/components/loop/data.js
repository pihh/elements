export default  {
  list: [1, 2, 3],
  color: "indigo",
  colors: ["red","green","yellow","indigo","blue"],
  object: {
    title: "Made with ❤️ by pihh",
    objectList: [
      { a: "a", b: "b", c: "c", id: 0, innerList: [1, 2, 3, 4] },
      { a: "a", b: "b", c: "c", id: 1, innerList: [1, 2, 3, 4] },
      { a: "a", b: "b", c: "c", id: 2, innerList: [1, 2, 3, 4] },
    ].map((el) => {
      el.a = el.a + "_" + el.id;
      el.b = el.b + "_" + el.id;
      el.c = el.c + "_" + el.id;
      return el;
    }), 
  },
};