describe("test main page", () => {
  it("should open avatar modal and select multiple avatars", () => {
    cy.visit("http://localhost:5173/"); // Переход на страницу входа
    const avatarIndexes = [0, 1, 2]; // Индексы аватаров для выбора

    avatarIndexes.forEach((avatarIndex) => {
      // Проверяем, что модальное окно не открыто
      cy.get(".ReactModal__Content").should("not.exist");

      // Кликаем по кнопке с иконкой, чтобы открыть модальное окно
      cy.get("#ChangeAvatar").click();

      // Проверяем, что модальное окно появилось
      cy.get(".ReactModal__Content").should("be.visible");

      // Выбираем аватар по индексу из массива
      cy.get(`[data-testid="avatar-${avatarIndex}"]`).click();

      // Проверяем, что аватар выбран (например, по изменению границы)
      cy.get(`[data-testid="avatar-${avatarIndex}"]`).should(
        "have.css",
        "border-color",
        "rgb(23, 145, 255)"
      );

      // Нажимаем кнопку подтверждения
      cy.get("#SubmitAvatarBtn").click();

      // Модальное окно должно закрыться
      cy.get(".ReactModal__Content").should("not.exist");
    });
  });

  it("should select a point value from dropdown and create a room", () => {
    // Переход на страницу создания комнаты
    cy.visit("http://localhost:5173/create");

    // Проверяем, что селект отобразился
    cy.get("#set_up_select_points").should("exist");
    cy.wait(5000);
    // Открываем дропдаун и выбираем значение "150"
    cy.get("#set_up_select_points").click();

    cy.wait(5000);
    cy.contains("150").click();

    // Проверяем, что правильное значение было выбрано
    cy.get("#set_up_select_points").contains("150").should("be.visible");
    cy.wait(2000);
    // Настраиваем тему и создаем комнату
    cy.get("#set_up_thema_item_container").should("exist").click();
    cy.get("#set_up_button").should("exist").click();

    cy.wait(10000);
    // Захватываем URL с roomId после создания комнаты
    cy.url()
      .should("include", "/room/")
      .then((url) => {
        const roomId = url.split("/room/")[1];

        // Убедимся, что roomId существует
        expect(roomId).to.exist;

        // Дополнительные проверки для удостоверения, что комната создана
        // Например, проверка наличия заголовка комнаты или других элементов
        cy.get(".room-title").should("contain", roomId);
      });
  });
});
