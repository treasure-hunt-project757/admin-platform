import { Location } from "../redux/models/Types";

export const Locations: Location[] = [
  {
    name: "מטבח",
    description: "המטבח בקומה 2 שנמצא בכניסה הראשונה",
    objects: [
      {
        name: "כיסא",
        image: "url_img",
        description: "כיסא עם גלגלים בצבע אדום",
        lastModifiedDate: new Date(2024, 2, 1),
        sector: "משתמש 2",
      },
    ],
    floor: 0,
  },
  {
    name: "סלון",
    description: "הסלון בקומה 1 עם נוף יפה לחצר",
    objects: [
      {
        name: "ספה",
        image: "url_img",
        description: "ספה גדולה ונוחה בצבע כחול",
        lastModifiedDate: new Date(2024, 2, 5),
        sector: "משתמש 1",
      },
      {
        name: "שולחן סלון",
        image: "url_img",
        description: "שולחן עץ עגול עם רגליים מעוצבות",
        lastModifiedDate: new Date(2024, 2, 5),
        sector: "משתמש 1",
      },
    ],
    floor: 0,
  },
  {
    name: "חדר שינה",
    description: "חדר השינה הראשי עם מיטה זוגית וארון",
    objects: [
      {
        name: "מיטה",
        image: "url_img",
        description: "מיטה זוגית גדולה ונוחה",
        lastModifiedDate: new Date(2024, 2, 10),
        sector: "משתמש 3",
      },
      {
        name: "ארון",
        image: "url_img",
        description: "ארון לבן עם מראה מודרני",
        lastModifiedDate: new Date(2024, 2, 10),
        sector: "משתמש 3",
      },
    ],
    floor: 0,
  },
];
