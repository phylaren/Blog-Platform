Авторизація (Auth)
1. POST /api/auth/register — Реєстрація нового користувача
2. POST /api/auth/login — Логін (повертає JWT)
3. GET /api/auth/me — Отримання профілю поточного юзера

Користувачі (Users)
4. GET /api/users — Список користувачів (тільки для Admin)
5. GET /api/users/:id — Профіль конкретного автора
6. PUT /api/users/:id — Оновлення даних профілю

Пости (Posts)
7. GET /api/posts — Список опублікованих постів (з пагінацією)
8. GET /api/posts/:id — Отримання одного поста за ID
9. POST /api/posts — Створення нового поста
10. PUT /api/posts/:id — Редагування поста (тільки автор або Admin)
11. DELETE /api/posts/:id — Видалення поста (тільки автор або Admin)

Коментарі (Comments)
12. GET /api/posts/:postId/comments — Отримання коментарів до поста
13. POST /api/posts/:postId/comments — Додавання коментаря
14. DELETE /api/comments/:id — Видалення коментаря

Категорії (Categories)
15. GET /api/categories — Список усіх категорій
16. POST /api/categories — Створення категорії (тільки Admin)
17. DELETE /api/categories/:id — Видалення категорії