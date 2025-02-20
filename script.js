document.addEventListener("DOMContentLoaded", () => {
    const puzzleContainer = document.getElementById("puzzle-container");
    const messageDiv = document.getElementById("message");
    const pieces = [];
    const correctOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    let shuffledOrder = generateSolvableShuffle([...correctOrder]);

    // Tạo các mảnh ghép
    for (let i = 0; i < 16; i++) {
        const piece = document.createElement("div");
        piece.classList.add("puzzle-piece");
        if (shuffledOrder[i] === 15) {
            piece.classList.add("empty"); // Thêm class 'empty' cho ô trống
        } else {
            piece.style.backgroundImage = "url('images/puzzle-image.jpg')";
            piece.style.backgroundPosition = `-${(shuffledOrder[i] % 4) * 100}px -${Math.floor(shuffledOrder[i] / 4) * 100}px`;
        }
        piece.dataset.index = shuffledOrder[i];
        piece.addEventListener("click", () => movePiece(piece));
        puzzleContainer.appendChild(piece);
        pieces.push(piece);
    }

    // Hàm di chuyển mảnh ghép
    function movePiece(piece) {
        const emptyIndex = shuffledOrder.indexOf(15);
        const pieceIndex = shuffledOrder.indexOf(parseInt(piece.dataset.index));

        if (isAdjacent(emptyIndex, pieceIndex)) {
            swapPieces(emptyIndex, pieceIndex);
            checkCompletion();
        }
    }

    // Kiểm tra xem hai mảnh có kề nhau không
    function isAdjacent(index1, index2) {
        const row1 = Math.floor(index1 / 4);
        const col1 = index1 % 4;
        const row2 = Math.floor(index2 / 4);
        const col2 = index2 % 4;
        return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
    }

    // Hoán đổi vị trí hai mảnh
    function swapPieces(index1, index2) {
        [shuffledOrder[index1], shuffledOrder[index2]] = [shuffledOrder[index2], shuffledOrder[index1]];
        updatePuzzle();
    }

    // Cập nhật giao diện sau khi hoán đổi
    function updatePuzzle() {
        pieces.forEach((piece, index) => {
            const pos = shuffledOrder[index];
            if (pos === 15) {
                piece.classList.add("empty");
                piece.style.backgroundImage = "none";
            } else {
                piece.classList.remove("empty");
                piece.style.backgroundImage = "url('images/puzzle-image.jpg')";
                piece.style.backgroundPosition = `-${(pos % 4) * 100}px -${Math.floor(pos / 4) * 100}px`;
            }
            piece.dataset.index = pos;
        });
    }

    // Kiểm tra xem đã hoàn thành chưa
    function checkCompletion() {
        if (shuffledOrder.every((val, index) => val === correctOrder[index])) {
            messageDiv.classList.remove("hidden");
        }
    }

    // Hàm tạo mảng xáo trộn có thể giải được
    function generateSolvableShuffle(array) {
        let shuffled = shuffle(array);
        while (!isSolvable(shuffled)) {
            shuffled = shuffle(array);
        }
        return shuffled;
    }

    // Hàm kiểm tra tính khả thi của trạng thái xáo trộn
    function isSolvable(array) {
        let inversions = 0;
        for (let i = 0; i < array.length; i++) {
            for (let j = i + 1; j < array.length; j++) {
                if (array[i] !== 15 && array[j] !== 15 && array[i] > array[j]) {
                    inversions++;
                }
            }
        }
        const emptyRow = Math.floor(array.indexOf(15) / 4);
        return (inversions % 2 === 0) === (emptyRow % 2 === 1);
    }

    // Hàm xáo trộn mảng
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
