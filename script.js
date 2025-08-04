document.addEventListener('DOMContentLoaded', function () {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const startBtn = document.getElementById('start-btn');
    const fadeOverlay = document.getElementById('fade-overlay');
    const snackBtn = document.getElementById('snack-btn');
    const dateBtn = document.getElementById('date-btn');
    const shopBtn = document.getElementById('shop-btn');
    const eventBtn = document.getElementById('event-btn');
    const character = document.getElementById('character');
    const speechBubble = document.getElementById('speech-bubble');
    const speechText = document.getElementById('speech-text');
    const startScreenBackground = document.querySelector('#start-screen .background');
    const gameBackground = document.querySelector('#game-screen .background');
    const snackUI = document.getElementById('snack-ui');
    const snackList = document.querySelector('.snack-list');
    const noItemsMessage = document.createElement('p');
    const levelText = document.getElementById('level-text'); // レベル表示用のテキスト
    const menuBtn = document.getElementById('menu-btn');
    const menuOptions = document.getElementById('menu-options');

    let isAnimating = false;
    let index = 0;
    let isTextFullyDisplayed = false;
    let isCooldown = false;
    let snack = 0;
    let message2 = 0;

    // XPとレベルの初期値をローカルストレージから読み込む
    let xp = localStorage.getItem('xp') ? parseInt(localStorage.getItem('xp')) : 0;  // 現在のXP
    let level = localStorage.getItem('level') ? parseInt(localStorage.getItem('level')) : 1; // 現在のレベル

    levelText.textContent = `${level}`; // 初期レベル表示

    const messages = [
        "なにー",
        "おはよー！！",
        "よいしょ",
        "ん？"
    ];

    function getRandomMessage() {
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    }

    // スタート画面の背景もクリックでゲームを開始できるようにする
    startScreenBackground.addEventListener('click', function() {
        message2 = 0;
        snack = 0;
        startScreen.style.transition = 'opacity 1s';
        startScreen.style.opacity = 0;

        setTimeout(() => {
            startScreen.style.display = 'none';
            gameScreen.classList.remove('hidden');
            gameScreen.style.transition = 'opacity 1s';
            gameScreen.style.opacity = 1;
        }, 1000);
    });

    startBtn.addEventListener('click', function() {
        startScreen.style.transition = 'opacity 1s';
        startScreen.style.opacity = 0;
        snack = 0;
        message2 = 0;

        setTimeout(() => {
            startScreen.style.display = 'none';
            gameScreen.classList.remove('hidden');
            gameScreen.style.transition = 'opacity 1s';
            gameScreen.style.opacity = 1;
        }, 1000);
    });

    // キャラクターをタップしたときのイベント
    character.addEventListener('click', function() {
        menuOptions.classList.remove('show');
        if (!speechBubble.classList.contains('hidden')) {
            if (isCooldown) return;

            if (isTextFullyDisplayed) {
                speechBubble.classList.add('hidden');
                message2 = 0;
            } else if (index < message.length) {
                while (index < message.length) {
                    speechText.textContent += message.charAt(index);
                    index++;
                }
                isTextFullyDisplayed = true;
            }
            return;
        }

        if (snack == 0 && message2 === 0) {
            // XPが増える
            xp++;  
            updateLevel(); // レベルアップをチェック
            saveGameData(); // ローカルストレージに保存
            message2 = 1;
            if (isAnimating) return;

            isCooldown = true;
            isAnimating = true;

            character.classList.add('bounce');
            speechBubble.classList.remove('hidden');
            speechText.textContent = "";
            index = 0;
            isTextFullyDisplayed = false;

            const message = getRandomMessage();

            function displayNextChar() {
                if (index < message.length) {
                    speechText.textContent += message.charAt(index);
                    index++;
                    setTimeout(displayNextChar, 100);
                } else {
                    isTextFullyDisplayed = true;
                    message2 = 1;
                }
            }

            displayNextChar();

            setTimeout(() => {
                character.classList.remove('bounce');
                isAnimating = false;
            }, 500);

            setTimeout(() => {
                isCooldown = false;
            }, 100);
        }
        snackUI.classList.add('hidden');
        snack = 0
    });

    // レベルアップの処理
    function updateLevel() {
        const xpForNextLevel = level * level;  // 次のレベルに必要なXP（レベル^2）

        if (xp >= xpForNextLevel) {
            level++;
            xp = 0; // レベルアップしたらXPをリセット
            levelText.textContent = `${level}`;  // レベル表示を更新
        }
    }

    // ローカルストレージにゲームデータを保存する関数
    function saveGameData() {
        localStorage.setItem('xp', xp);  // XPを保存
        localStorage.setItem('level', level);  // レベルを保存
    }

    // 吹き出しがクリックされた時にセリフを非表示にする
    speechBubble.addEventListener('click', function() {
        menuOptions.classList.remove('show');
        if (isCooldown) return;

        if (isTextFullyDisplayed) {
            speechBubble.classList.add('hidden');
            message2 = 0;
        } else if (index < message.length) {
            while (index < message.length) {
                speechText.textContent += message.charAt(index);
                index++;
            }
            isTextFullyDisplayed = true;
        }
    });

    // 背景がクリックされた時にセリフを非表示にする
    gameBackground.addEventListener('click', function() {
        snackUI.classList.add('hidden');
        menuOptions.classList.remove('show');
        snack = 0
        if (isCooldown) return;

        if (isTextFullyDisplayed) {
            message2 = 0;
            speechBubble.classList.add('hidden');
        } else if (index < message.length) {
            while (index < message.length) {
                speechText.textContent += message.charAt(index);
                index++;
            }
            isTextFullyDisplayed = true;
        }
    });

    // メニューボタンのクリック処理

    menuBtn.addEventListener('click', function() {
        menuOptions.classList.toggle('show');
    });

    // メニューオプションのクリック処理
    const goToStart = document.getElementById('go-to-start');
    const notifications = document.getElementById('notifications');
    const deleteData = document.getElementById('delete-data');
    const contactUs = document.getElementById('contact-us');

    goToStart.addEventListener('click', function() {
        // スタート画面に戻る処理を実装
        window.location.reload(); // 画面をリロードしてスタート画面に戻す
    });

    notifications.addEventListener('click', function() {
        alert('お知らせの内容がここに表示されます。');
    });

    deleteData.addEventListener('click', function() {
        if (confirm('本当にデータを削除してもよろしいですか？')) {
            localStorage.clear();  // ローカルストレージを削除
            alert('スタート画面に戻ります');
            window.location.reload();  // 画面をリロードして、削除されたことを確認する
        }
    });

    contactUs.addEventListener('click', function() {
        window.location.href = 'https://forms.gle/2nGNJk2HqRMUj4mHA';  // 指定されたURLにリダイレクト
    });
    

    // 購入したアイテムの取得
    const purchasedItems = JSON.parse(localStorage.getItem('purchasedItems')) || [];

    // おやつのデータ（名前、画像、個数）
    const snacks = [
        { name: 'いちご', image: 'textures/items/strawberry.png', count: 1 },
        { name: 'マカロン', image: 'textures/items/macaron.png', count: 1 },
        { name: 'ドーナツ', image: 'textures/items/donut.png', count: 1 }
    ];

    // ユーザーが持っているおやつ（購入したアイテムのみ）
    const ownedSnacks = snacks.filter(snack => purchasedItems.includes(snack.name));

    // おやつボタンを押した時におやつUIを表示
    snackBtn.addEventListener('click', function() {
        if (message2 == 0) {
            snackUI.classList.remove('hidden'); // おやつUIを表示
            snackList.innerHTML = ''; // リストをクリア
            snack = 1;

            // ユーザーが持っているおやつをリストに追加
            if (ownedSnacks.length === 0) {
                // アイテムが一つもない場合にメッセージを表示
                noItemsMessage.textContent = 'アイテムがありません。';
                snackList.appendChild(noItemsMessage);
            } else {
                ownedSnacks.forEach(snack => {
                    const snackItem = document.createElement('div');
                    snackItem.classList.add('snack-item');
                
                    // 画像を表示
                    const snackImage = document.createElement('img');
                    snackImage.src = snack.image;
                    snackItem.appendChild(snackImage);

                    // アイテム名と個数を表示
                    const snackName = document.createElement('p');
                    snackName.textContent = `${snack.name} - ${snack.count}個`; // 個数も表示
                    snackItem.appendChild(snackName);

                    // おやつをクリックしたときの処理
                    snackItem.addEventListener('click', function() {
                        // アイテムの個数が1個以上のときだけ消費できるようにする
                        if (snack.count > 0) {
                            snack.count--; // アイテムを1個消費

                            // ローカルストレージから購入したアイテムを取得
                            let purchasedItems = JSON.parse(localStorage.getItem('purchasedItems')) || [];

                            // アイテムの名前を消費したアイテムリストから削除
                            const snackIndex = purchasedItems.indexOf(snack.name);
                            if (snackIndex !== -1) {
                                purchasedItems.splice(snackIndex, 1); // アイテムを削除
                            }

                            // 更新されたアイテムリストをローカルストレージに保存
                            localStorage.setItem('purchasedItems', JSON.stringify(purchasedItems));

                            // UIを更新
                            snackName.textContent = `${snack.name} - ${snack.count}個`; // 個数を更新

                            // アイテムを消費後、0個になったらリストから削除する
                            if (snack.count === 0) {
                                snackItem.remove(); // アイテムがなくなった場合、リストから削除
                            }
                        }
                    });

                    snackList.appendChild(snackItem); // アイテムをリストに追加
                });
            }
        }
    });

    shopBtn.addEventListener('click', function() {
        if (message2 == 0) {
            window.location.href = 'shop.html'; // index.html へ遷移
        }
    });
});
