let quill = new Quill('#editor', {
	modules: {
		toolbar: [['bold', 'italic', 'underline', 'strike'], // 굵게, 기울임, 밑줄, 취소선
		['blockquote', 'code-block'], // 인용 블록, 코드 블록

		[{
			'header': 1
		}, {
			'header': 2
		}], // 제목 크기
		[{
			'list': 'ordered'
		}, {
			'list': 'bullet'
		}], // 순서 있는 목록, 순서 없는 목록
		[{
			'script': 'sub'
		}, {
			'script': 'super'
		}], // 위첨자, 아래첨자
		[{
			'indent': '-1'
		}, {
			'indent': '+1'
		}], // 들여쓰기, 내어쓰기
		[{
			'direction': 'rtl'
		}], // 텍스트 방향

		[{
			'size': ['small', false, 'large', 'huge']
		}], // 폰트 크기
		[{
			'header': [1, 2, 3, 4, 5, 6, false]
		}], // 제목 레벨

		[{
			'color': []
		}, {
			'background': []
		}], // 폰트 색, 배경 색
		[{
			'font': []
		}], // 폰트 종류
		[{
			'align': []
		}], // 텍스트 정렬

		['image'], // 링크, 이미지, 비디오 삽입

		['clean'] // 포맷 지우기
		]
	},
	placeholder: '내용을 입력하세요...', // placeholder 텍스트
	theme: 'snow'
});

quill.on("text-change", function() {
	document.getElementById("quill_html").value = quill.root.innerHTML;
})

quill.getModule('toolbar').addHandler("image", function() {
	selectLocalImage();
})

function selectLocalImage() {
	const fileInput = document.createElement("input");
	fileInput.setAttribute("type", "file");

	fileInput.click();

	fileInput.addEventListener("change", function() {
		const formData = new FormData();
		const file = fileInput.files[0];
		formData.append("uploadFile", file); //스프링에서 @RequestParam("uploadFile") 로 받아야한다.
		fetch("/notice/quillUpload", {
			method: "POST",
			body: formData
		}).then(r => r.text())
			.then(r => {
				//console.log(r);
				const range = quill.getSelection();
				quill.insertEmbed(range.index, 'image', "/files/" + r);
			})

	})

}

const fileBtn = document.getElementById("fileBtn");
const fileInput = document.getElementById("hiddenFileInput");
const attachesArea = document.getElementById("attachesArea");

let selectedFiles = [];

fileBtn.addEventListener("click", ()=>{
	fileInput.click();
})

fileInput.addEventListener("change", () => {
  for (const file of fileInput.files) {
    selectedFiles.push(file); // 누적 추가
    addFileBadge(file);       // 화면에 표시
  }
  fileInput.value = ""; // 같은 파일 다시 선택 가능하게
});

function addFileBadge(file) {
  const fileId = `${file.name}-${file.size}`;

  const div = document.createElement("div");
  div.classList.add("file-badge", "d-flex", "align-items-center", "mr-2");

  const name = document.createElement("div");
  name.innerText = file.name;

  const btn = document.createElement("button");
  btn.innerText = "X";
  btn.classList.add("btn", "btn-sm");
  btn.addEventListener("click", () => {
    // 리스트에서 제거
    selectedFiles = selectedFiles.filter(f => `${f.name}-${f.size}` !== fileId);
    div.remove(); // UI에서도 제거
  });

  div.appendChild(name);
  div.appendChild(btn);
  attachesArea.appendChild(div);
}


document.addEventListener("keydown", (e)=>{
	if(e.key == "Enter"){
		const tagName = e.target.tagName.toLowerCase();

		// input, 버튼 등에서만 기본 동작 막기 (submit 방지)
		if (tagName === "input") {
			e.preventDefault();
		}
	}
})

//보내기
const noticeTitle = document.getElementById("noticeTitle");
const noticeContents = document.getElementById("quill_html");

const noticeAdd = document.getElementById("noticeAdd");

noticeAdd.addEventListener("click", () => {
	const f = new FormData();
	f.append("noticeTitle", noticeTitle.value);
	f.append("noticeContents", noticeContents.value);
	
	for(file of selectedFiles){
		f.append("attaches", file);
	}

	fetch("./add", {
		method: "POST",
		body: f
	})
	.then(r => r.text())
	.then(r => {
		if(r*1 > 0){
			alert("작성이 완료 되었습니다.");
			location.href = "./list";
		}
	})
})