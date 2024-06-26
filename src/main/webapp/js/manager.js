$(document).ready(function() {
	// 삭제 버튼 클릭 시 해당 배너 행을 제거하는 이벤트
	// $(document).on('click', '#delete_btn', function () {
	//   $(this).closest('.banner_row').remove();
	//   // 순번 업데이트 함수 호출
	//   updateBannerSequence();
	//   // 삭제 버튼 상태 업데이트
	//   toggleDeleteButton();
	// });

	$('#delete_btn').click(function() {
		$('input[name="checked"]:checked').each(function() {
			$(this).closest('.banner_row').remove();
		});
		// 순번 업데이트 함수 호출
		updateBannerSequence();
		// 삭제 버튼 상태 업데이트
		toggleDeleteButton();
	});
	// 체크박스 상태에 따라 삭제 버튼 활성화/비활성화 함수
	function toggleDeleteButton() {
		var checked = $('input[type="checkbox"]:checked').length > 0;
		$('#delete_btn').prop('disabled', !checked);
	}

	// 체크박스 상태 변경 시 삭제 버튼 활성화/비활성화
	$(document).on('change', 'input[type="checkbox"]', function() {
		toggleDeleteButton();
	});

	// 배너 추가 버튼 클릭 시 새로운 배너 행을 추가하는 이벤트
	$('#add_banner_btn').click(function() {
		// 헤더 행을 제외한 현재 배너 개수 계산
		var bannerCount = $('.banner_row').length - 1;
		var newBannerRow = `
        <div class="banner_row">
          <div class="banner_col banner_checked">
            <input type="checkbox" name="checked">
            <label for="checked"></label>
          </div>
          <div class="banner_col banner_seq">
            <span>${bannerCount + 1}</span>
          </div>
          <div class="banner_col banner_img">
            <div class="image_container">
              <input type="file" class="real_upload" accept="image/*" required>
              <div class="upload">+</div>
            </div>
          </div>
          <div class="banner_col banner_url">
            <div class="url_cont">
              <span>url:</span>
              <input type="text" class="url_input">
            </div>
          </div>
          <div class="banner_col banner_use">
            <div class="use_select">
              <fieldset>
                <label>
                  <input type="radio" name="contact${bannerCount + 1
			}" value="use" checked />
                  <span>사용</span>
                </label>
                <label>
                  <input type="radio" name="contact${bannerCount + 1
			}" value="unuse" />
                  <span>사용 안함</span>
                </label>
              </fieldset>
            </div>
          </div>
        </div>
      `;
		$('.select_banner').append(newBannerRow);
		// 순번 업데이트 함수 호출
		updateBannerSequence();
		// 삭제 버튼 상태 업데이트
		toggleDeleteButton();
	});

	// 전체 선택 체크 박스 기능 추가
	$('#check_all').change(function() {
		var isChecked = $(this).prop('checked');
		$('input[name="checked"]').prop('checked', isChecked);
		// 삭제 버튼 상태 업데이트
		toggleDeleteButton();
	});

	// 개별 체크 박스 선택 시 전체 선택 체크 박스 상태 변화
	$('input[name="checked"]').change(function() {
		var allChecked = true;
		$('input[name="checked"]').each(function() {
			if (!$(this).prop('checked')) {
				allChecked = false;
			}
		});
		$('#check_all').prop('checked', allChecked);
		// 삭제 버튼 상태 업데이트
		toggleDeleteButton();
	});

	// 배너 순번 업데이트 함수
	function updateBannerSequence() {
		$('.banner_row').each(function(index) {
			if (index > 0) {
				// 헤더 행을 제외하고 순번 업데이트
				$(this).find('.banner_seq span').text(index);
			}
		});
	}

	// 이미지 업로드 버튼 클릭 시 실제 파일 업로드 입력을 클릭하도록 하는 이벤트
	$(document).on('click', '.upload', function() {
		$(this).siblings('.real_upload').click();
	});

	// 파일 입력 변경 시 미리보기 및 재업로드 기능
	$(document).on('change', '.real_upload', function() {
		var input = this;
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				var imageContainer = $(input)
					.closest('.banner_img')
					.find('.image_container');
				// 기존 이미지 삭제
				imageContainer.find('img').remove();
				imageContainer.append(
					'<img src="' + e.target.result + '" alt="banner image">'
				);
			};
			reader.readAsDataURL(input.files[0]);
		}
	});

	// 수정 완료 버튼 클릭 시 처리할 내용
	$('#submit_changes_btn').click(function() {
		// 여기에 수정된 내용을 전송하는 로직 추가
		alert('수정된 내용을 전송합니다.');
	});
});

// 전체 회원을 출력할 지 블랙 리스트를 출력할 지 선택하는 메서드
function change_grade(grade) {

	if (grade == '회원') {
		// 일반 회원을 출력하고 싶은 경우

		$(".blacklist").removeClass("cpage");
		$(".user").addClass("cpage");

		get_member_list("회원", 1);

	} else {
		// 블랙리스트를 출력하고 싶은 경우

		$(".blacklist").addClass("cpage");
		$(".user").removeClass("cpage");

		get_member_list("정지된 회원", 1);
	}
}

// 회원 관리 영역에서 검색창에 enter 키 눌렀을 때 검색 회원 검색 기능
$(".member_con .input_tag").on("keydown", function(e) {
	if (e.key === 'Enter' || e.keyCode === 13 || e.which === 13) {
		// Enter 키가 눌렸을 때 실행할 코드
		search_user();
	}
});

// 검색한 회원을 출력하는 메서드
function search_user(cpage, moment) {

	if ($(".input_tag").val() == "" && moment == 'first') {
		alert("검색할 내용을 먼저 입력해주세요");
		return;
	}

	$(".list_table>div:not(.table_header)").remove();
	$(".pagination").empty();

	if (cpage === undefined) {
		// 페이지 첫 시작이거나 변수가 정의되지 않았을 경우 초기값 설정
		cpage = 1;
	}
	let grade = "회원";
	if ($("a.grade.cpage").text() == "블랙리스트") {
		grade = "정지된 회원";
	}

	let user_info = $(".input_tag").val();

	$.ajax({
		url: "/getSearchNum.member",
		dataType: "json",
		data: {
			grade: grade,
			user_info: user_info
		}
	}).done(function(resp) {
		let record_count_per_page = resp.record_count_per_page;
		let navi_count_per_page = resp.navi_count_per_page;
		let record_total_count = resp.total_data;

		console.log(record_total_count);
		if (record_total_count > 0) {

			// 필요한 Page navigator의 수
			let page_total_count = 0;

			if (record_total_count % record_count_per_page > 0) {
				// 전체 게시글을 한 페이지 당 노출할 게시글 수로 나눴을 때 나머지가 존재한다면 navi 수는 (전체 게시글 / 한 페이지 당 게시글 + 1)
				page_total_count = record_total_count / record_count_per_page + 1;
			} else {
				// 나머지가 존재하지 않는다면 navi 수는 (전체 게시글 / 한 페이지 당 게시글)
				page_total_count = record_total_count / record_count_per_page;
			}

			// 현재 페이지의 Page Navigator들 중 시작 번호
			let start_navi = Math.floor((cpage - 1) / navi_count_per_page) * navi_count_per_page + 1;
			// 현재 페이지의 Page Navigator들 중 끝 번호
			let end_navi = start_navi + navi_count_per_page - 1;

			if (end_navi > page_total_count) {
				end_navi = page_total_count;
			}

			let need_next = end_navi < page_total_count;
			let need_prev = start_navi > 1;

			// 페이지네이션 HTML 생성
			let page_nation = $(".pagination");
			page_nation.empty();

			// '이전 페이지로' 버튼
			let prev_btn = $("<a>", { "class": "page_navi arr_navi start_arr", "href": "javascript:search_user(" + (start_navi - 1) + ", 'no_first')" });
			let prev_img = $("<img>", { "class": "navi_icon start_navi", "src": "../image/icon/pagination.png", "alt": "start navi 로고" });
			if (!need_prev) {
				prev_btn.addClass("disabled");
			}
			prev_btn.append(prev_img);
			page_nation.append(prev_btn);


			// 페이지 번호
			for (let i = start_navi; i <= end_navi; i++) {
				let page_navi = $("<a>", { "class": "page_navi", "href": "javascript:search_user(" + i + ", 'no_first')" });
				page_navi.text(i);
				if (cpage == i) {
					page_navi.addClass("active");
				}
				page_nation.append(page_navi);
			}

			// '다음 페이지로' 버튼
			let next_btn = $("<a>", { "class": "page_navi arr_navi end_arr", "href": "javascript:search_user(" + (end_navi + 1) + ",'no_first')" });
			let next_img = $("<img>", { "class": "navi_icon end_navi", "src": "../image/icon/pagination.png", "alt": "end navi 로고" });
			if (!need_next) {
				next_btn.addClass("disabled");
			}
			next_btn.append(next_img);
			page_nation.append(next_btn);

			// 검색한 데이터를 ajax로 받아오기	
			$.ajax({
				url: "/trySearch.member",
				dataType: "json",
				data: {
					grade: grade,
					user_info: user_info,
					cpage: cpage
				}
			}).done(function(resp) {
				let index = cpage * 10 - 9;
				for (let i of resp) {

					let row = $("<div>", { "class": "table_row" });
					let col = $("<div>", { "class": "table_col" });
					let span = $("<span>");

					// table_col 첫번째 요소에 index 값 삽입
					span.text(index++);
					col.append(span);
					row.append(col);

					// table_col 두번째 요소에 userid 값 삽입
					col = $("<div>", { "class": "table_col user_id" });
					span = $("<span>");
					span.text(i.userid);
					col.append(span);
					row.append(col);

					// table_col 세번째 요소에 nickname 값 삽입
					col = $("<div>", { "class": "table_col" });
					span = $("<span>");
					span.text(i.nickname);
					col.append(span);
					row.append(col);

					// table_col 네번째 요소에 join_date 값 삽입
					col = $("<div>", { "class": "table_col" });
					span = $("<span>");
					span.text(i.join_date);
					col.append(span);
					row.append(col);

					// table_col 다섯번째 요소에 member_seq 및 버튼 삽입
					col = $("<div>", { "class": "table_col" });
					let btn = $("<button>");
					if (grade == "정지된 회원") {
						btn.addClass("to_user");
						btn.text("해제");
					} else {
						btn.addClass("to_black");
						btn.text("등록");
					}
					col.append(btn);
					row.append(col);

					// 테이블에 데이터 출력
					$(".list_table").append(row);

					// 해당 회원의 등급을 변경하는 경우
					$('button').off().on('click', function() {
						let user_id = $(this).closest(".table_row").children(".user_id").text();
						$.ajax({
							url: "/changeGrade.member",
							dataType: "json",
							data: {
								user_id: user_id,
								grade: grade
							}
						}).done(function(resp) {
							if (resp < 1) {
								alert("오류가 발생했습니다.");
							}
							search_user(cpage);
						});
					});
				}
			});
		} else {
			// 검색한 결과가 없을 경우
			let row = $("<div>", { "class": "table_row" });
			row.css({
				"font-size": "16px",
				"justify-content": "center",
				"color": "var(--color-white)",
				"padding": "15px"
			});
			row.text("검색한 결과가 존재하지 않습니다");
			$(".list_table").append(row);
		}
		$(".input_tag").val("");
	});
}

// 해당 페이지의 회원 목록을 불러오는 메서드 
function get_member_list(grade, cpage) {
	// 테이블 헤더 영역을 제외한 데이터 비우기
	$(".list_table>div:not(.table_header)").remove();

	if (grade === undefined) {
		// 페이지 첫 시작이거나 변수가 정의되지 않았을 경우 초기값 설정
		grade = "회원";
	}
	if (cpage === undefined) {
		// 페이지 첫 시작이거나 변수가 정의되지 않았을 경우 초기값 설정
		cpage = 1;
	}

	// 해당 등급의 총 회원 수를 불러오기 위한 코드
	$.ajax({
		url: "/total.member",
		dataType: "json",
		data: { grade: grade }
	}).done(function(resp) {

		let record_count_per_page = resp.record_count_per_page;
		let navi_count_per_page = resp.navi_count_per_page;
		let record_total_count = resp.total_data;

		if (record_total_count > 0) {


			// 필요한 Page navigator의 수
			let page_total_count = 0;

			if (record_total_count % record_count_per_page > 0) {
				// 전체 게시글을 한 페이지 당 노출할 게시글 수로 나눴을 때 나머지가 존재한다면 navi 수는 (전체 게시글 / 한 페이지 당 게시글 + 1)
				page_total_count = record_total_count / record_count_per_page + 1;
			} else {
				// 나머지가 존재하지 않는다면 navi 수는 (전체 게시글 / 한 페이지 당 게시글)
				page_total_count = record_total_count / record_count_per_page;
			}

			// 현재 페이지의 Page Navigator들 중 시작 번호
			let start_navi = Math.floor((cpage - 1) / navi_count_per_page) * navi_count_per_page + 1;
			// 현재 페이지의 Page Navigator들 중 끝 번호
			let end_navi = start_navi + navi_count_per_page - 1;

			if (end_navi > page_total_count) {
				end_navi = page_total_count;
			}

			let need_next = end_navi < page_total_count;
			let need_prev = start_navi > 1;

			// 페이지네이션 HTML 생성
			let page_nation = $(".pagination");
			page_nation.empty();

			// '이전 페이지로' 버튼
			let prev_btn = $("<a>", { "class": "page_navi arr_navi start_arr", "href": "javascript:get_member_list(`" + grade + "`, " + (start_navi - 1) + ")" });
			let prev_img = $("<img>", { "class": "navi_icon start_navi", "src": "../image/icon/pagination.png", "alt": "start navi 로고" });
			if (!need_prev) {
				prev_btn.addClass("disabled");
			}
			prev_btn.append(prev_img);
			page_nation.append(prev_btn);


			// 페이지 번호
			for (let i = start_navi; i <= end_navi; i++) {
				let page_navi = $("<a>", { "class": "page_navi", "href": "javascript:get_member_list(`" + grade + "`, " + i + ")" });
				page_navi.text(i);
				if (cpage == i) {
					page_navi.addClass("active");
				}
				page_nation.append(page_navi);
			}

			// '다음 페이지로' 버튼
			let next_btn = $("<a>", { "class": "page_navi arr_navi end_arr", "href": "javascript:get_member_list(`" + grade + "`, " + (end_navi + 1) + ")" });
			let next_img = $("<img>", { "class": "navi_icon end_navi", "src": "../image/icon/pagination.png", "alt": "end navi 로고" });
			if (!need_next) {
				next_btn.addClass("disabled");
			}
			next_btn.append(next_img);
			page_nation.append(next_btn);

			$.ajax({
				url: "/list.member",
				dataType: "json",
				data: {
					grade: grade,
					cpage: cpage
				}
			}).done(function(resp) {
				let index = cpage * 10 - 9;
				for (let i of resp) {

					let row = $("<div>", { "class": "table_row" });
					let col = $("<div>", { "class": "table_col" });
					let span = $("<span>");

					// table_col 첫번째 요소에 index 값 삽입
					span.text(index++);
					col.append(span);
					row.append(col);

					// table_col 두번째 요소에 userid 값 삽입
					col = $("<div>", { "class": "table_col user_id" });
					span = $("<span>");
					span.text(i.userid);
					col.append(span);
					row.append(col);

					// table_col 세번째 요소에 nickname 값 삽입
					col = $("<div>", { "class": "table_col" });
					span = $("<span>");
					span.text(i.nickname);
					col.append(span);
					row.append(col);

					// table_col 네번째 요소에 join_date 값 삽입
					col = $("<div>", { "class": "table_col" });
					span = $("<span>");
					span.text(i.join_date);
					col.append(span);
					row.append(col);

					// table_col 다섯번째 요소에 member_seq 및 버튼 삽입
					col = $("<div>", { "class": "table_col" });
					let btn = $("<button>");
					if (grade == "정지된 회원") {
						btn.addClass("to_user");
						btn.text("해제");
					} else {
						btn.addClass("to_black");
						btn.text("등록");
					}
					col.append(btn);
					row.append(col);

					// 테이블에 데이터 출력
					$(".list_table").append(row);

					// 해당 회원의 등급을 변경하는 경우
					$('button').off().on('click', function() {

						let user_id = $(this).closest(".table_row").children(".user_id").text();
						$.ajax({
							url: "/changeGrade.member",
							dataType: "json",
							data: {
								user_id: user_id,
								grade: grade
							}
						}).done(function(resp) {
							if (resp < 1) {
								alert("오류가 발생했습니다.");
							}
							get_member_list(grade, cpage);
						});
					});
				}
			});

		} else {
			// 조회 결과가 없을 경우
			let row = $("<div>", { "class": "table_row" });
			row.css({
				"font-size": "16px",
				"justify-content": "center",
				"color": "var(--color-white)",
				"padding": "15px"
			});
			row.text("등록된 회원이 존재하지 않습니다");
			$(".list_table").append(row);
		}
	});
}


// 게시글의 파일 목록을 받아오는 메서드
function get_file_list() {
	$.ajax({
		url: '/list.boardfile',
		dataType: 'json',
		data: { board_seq: get_board_seq() },
	}).done(function(resp) {
		if (resp.length == 0) {
			// 파일이 존재하지 않는 경우 버튼 클릭 불가능
			$('.file_option').attr('disabled', true).css('cursor', 'default');
			return 0;
		}

		let file_list = $('.file_list');
		file_list.empty();

		for (let i of resp) {
			let file = $('<div>', { "class": 'files' });
			let file_name = $('<a>', { "href": '/download.boardfile?sysname=' + i.sysname + "&oriname=" + i.oriname });
			file_name.css({ "display": "flex", "padding": "10px" });
			file_name.text(i.oriname);
			file.append(file_name);
			file_list.append(file);
		}
	});
}


// 댓글 목록 불러오는 메서드
function get_comm_list(order_by) {
	if (order_by == 'default') {
		// 정렬 기준이 dafault면 최신순으로 설정
		order_by = 'write_date';
	}
	$.ajax({
		url: '/list.reply',
		dataType: 'json',
		data: {
			board_seq: get_board_seq(),
			order_by: order_by,
		},
	}).done(function(resp) {
		let comm_list = $('.comm_list');
		comm_list.empty();
		if ((resp.board_info.length) == 0) {
			// 댓글이 존재하지 않는 경우
			let no_comm = $('<div>', { class: 'no_comm' });
			no_comm.text('댓글이 존재하지 않습니다.');
			comm_list.append(no_comm);
			return;
		}

		for (let i of resp.board_info) {
			let comm = $('<div>', { class: 'comm' });

			let comm_info = $('<div>', { class: 'comm_info' });
			let comm_seq = $('<div>', { class: 'comm_seq', style: 'display:none' });
			comm_seq.text(i.reply_seq);
			let comm_writer = $('<div>', { class: 'comm_writer' });
			comm_writer.text('작성자 : ' + i.nickname);
			let comm_date = $('<div>', { class: 'comm_date' });
			comm_date.text('작성일 : ' + i.write_date);
			comm_info.append(comm_seq, comm_writer, comm_date);

			let comm_cont = $('<div>', {
				class: 'comm_cont',
				contenteditable: 'false',
			});
			comm_cont.text(i.content);

			let edit_box = $('<div>', { class: 'edit_box' });

			let btn_box2 = $('<div>', { class: 'btn_box' });
			let del_btn = $('<button>', {
				class: 'write_btn comm_btn',
				type: 'button',
			});
			del_btn.text('임시 삭제');
			btn_box2.append(del_btn);
			edit_box.append(btn_box2);

			comm.append(comm_info, comm_cont, edit_box);
			comm_list.append(comm);

			$('.comm .write_btn')
				.off()
				.on('click', function() {
					let choice = $(this).text();

					if (choice == '임시 삭제') {
						// 삭제 버튼 클릭
						if (confirm('임시 보관함으로 이동시킵니까 ?')) {
							$.ajax({
								url: '/deleteYN_N_To_Y.reply',
								data: {
									reply_seq: $(this).closest('.comm').find('.comm_seq').text(),
								},
							}).done(function() {
								location.reload();
							});
						}
					}
				});
		}
	});
}

// 게시글의 seq 값을 반환하는 메서드
function get_board_seq() {
	return $('#board_seq').text().replace('# ', '');
}

// 추천 or 북마크 or 파일 중 클릭한 해당 기능을 수행하는 메서드
function click_option(element) {
	if ($(element).children('.fa-regular').css('display') == 'none') {
		// 해당 기능을 취소하는 경우
		if ($(element).hasClass('likes_option')) {
			// 좋아요 취소 기능
			if ($(element).hasClass('board_like')) {
				// 게시글 좋아요 취소
				$.ajax({
					url: '/delete.boardLike',
					data: { board_seq: get_board_seq() },
				});
			} else {
				// 댓글 좋아요 취소
				let comm = $(element);
				let reply_seq = comm.closest('.comm').find('.comm_seq').text();
				$.ajax({
					url: '/delete.replyLike',
					data: { reply_seq: reply_seq },
				}).done(function() {
					console.log('좋아요 취소');
					get_reply_likes(reply_seq);
				});
			}
		} else if ($(element).hasClass('mark_option')) {
			// 북마크 취소 기능
			console.log('북마크 취소');
			$.ajax({
				url: '/unsave.bookmark',
				data: { board_seq: get_board_seq() },
				type: 'POST',
			}).done(function() {
				// 북마크 취소 완료 후 처리
				$(element).removeClass('active');
			});
		} else {
			// 파일 목록 닫기 기능
			$('.file_list').hide();
		}
		$(element).children('.fa-regular').show();
		$(element).children('.fa-solid').hide();
	} else {
		// 해당 기능을 이용하려는 경우
		if ($(element).hasClass('likes_option')) {
			// 좋아요 기능
			if ($(element).hasClass('board_like')) {
				// 게시글 좋아요
				$.ajax({
					url: '/insert.boardLike',
					data: { board_seq: get_board_seq() },
				});
			} else {
				// 댓글 좋아요
				let comm = $(element);
				let reply_seq = comm.closest('.comm').find('.comm_seq').text();
				$.ajax({
					url: '/insert.replyLike',
					data: { reply_seq: reply_seq },
				}).done(function() {
					get_reply_likes(reply_seq);
				});
			}
		} else if ($(element).hasClass('mark_option')) {
			// 북마크 기능
			console.log('북마크 등록');
			$.ajax({
				url: '/save.bookmark',
				data: { board_seq: get_board_seq() },
				type: 'POST',
			}).done(function(resp) {
				// 북마크 저장 전송
				console.log(resp);
				$(element).addClass('active');
			});
		} else {
			// 파일이 존재하는 경우 파일 목록 열기 기능
			if (get_file_list() != 0 && element != null) {
				$('.file_list').show();
			}
		}
		$(element).children('.fa-regular').hide();
		$(element).children('.fa-solid').show();
	}
	get_options_record();
}

// 해당 댓글의 좋아요 수를 받아오기 위한 메서드
function get_reply_likes(reply_seq) {
	$.ajax({
		url: '/count.replyLike',
		dataType: 'json',
		data: { reply_seq: reply_seq },
	}).done(function(resp) {
		// reply_seq와 일치하는 .comm_seq 요소 선택
		let comm_seq = $('.comm_seq').filter(function() {
			return $(this).text() == reply_seq;
		});
		// .comm_seq 요소의 가장 가까운 .comm 요소를 찾고, 그 하위에 있는 <p> 요소의 텍스트를 업데이트
		comm_seq.closest('.comm').find('p').text(resp);
	});
}

// 해당 게시글의 북마크 수와 좋아요 수를 받아오는 메서드
function get_options_record() {
	// 북마크 수
	$.ajax({
		url: '/count.bookmark',
		dataType: 'json',
		data: { board_seq: get_board_seq() },
	}).done(function(resp) {
		$('.bookmark').text('스크랩 수 : ' + resp);
	});
	// 좋아요 수
	$.ajax({
		url: '/count.boardLike',
		dataType: 'json',
		data: { board_seq: get_board_seq() },
	}).done(function(resp) {
		$('#board_like').text(resp);
	});
}


// 관리자가 조회하는 게시글 상세 페이지에서 삭제 버튼 클릭 시
$('#del_btn').on('click', function() {
	if (confirm('임시 보관함으로 이동시킵니까?')) {
		location.href = '/deleteYN_N_To_Y.board?board_seq=' + get_board_seq();
	}
});

// 관리자가 조회하는 게시글 상세 페이지에서 삭제 버튼 클릭 시
$('#back_btn').on('click', function() {
	location.href = '/admin/community.jsp';
});

// 임시보관 게시물 페이지에서 복구 버튼 클릭 시
$(document).on("click", ".restore_board", function() {
	if (confirm('해당 게시물을 복구 시킵니까?')) {
		let board_seq = $(this).closest(".table_row").find("input").val();
		$.ajax({
			url: "/restoreUpdateToN.board",
			method: "POST",
			data: { board_seq: board_seq },
			success: function(response) {
				// 복구 성공 시 추가 처리
				location.reload();
				// 예를 들어, 복구가 성공했을 때 UI 갱신 등을 수행할 수 있습니다.
			},
			error: function(xhr, status, error) {
				// 오류 처리
				console.error("복구 실패:", error);
				// 복구 실패 시에는 사용자에게 알림 등을 제공할 수 있습니다.
			}
		});
	}

});


// 임시보관 댓글 페이지에서 복구 버튼 클릭 시
$(document).on("click", ".restore_reply", function(e) {
	// 상위 태그인 a 태그의 href 속성으로 이동 동작을 막기 위한 코드
	e.stopPropagation();
	e.preventDefault();

	if (confirm('해당 댓글을 복구 시킵니까?')) {
		let replySeq = $(this).closest(".table_row").find(".reply_seq span").text();
		$.ajax({
			url: "/deleteYN_Y_To_N.reply",
			method: "POST",
			data: { replySeq: replySeq },
			success: function(response) {
				// 복구 성공 시 추가 처리
				location.reload();
				// 예를 들어, 복구가 성공했을 때 UI 갱신 등을 수행할 수 있습니다.
			},
			error: function(xhr, status, error) {
				// 오류 처리
				console.error("복구 실패:", error);
				// 복구 실패 시에는 사용자에게 알림 등을 제공할 수 있습니다.
			}
		});
	}
});


// 게시판 관리 페이지의 각 데이터 목록을 불러오는 메서드 
function get_community_list(choice, cpage, deleted) {
	// 테이블 헤더 영역을 제외한 데이터 비우기
	$(".list_table>a").remove();

	if (choice === undefined) {
		// 페이지 첫 시작이거나 변수가 정의되지 않았을 경우 초기값 설정
		choice = "board";
	}
	if (cpage === undefined) {
		// 페이지 첫 시작이거나 변수가 정의되지 않았을 경우 초기값 설정
		cpage = 1;
	}
	if (deleted === undefined) {
		// 페이지 첫 시작이거나 변수가 정의되지 않았을 경우 초기값 설정
		deleted = "N";
	}
	// 해당 등급의 총 회원 수를 불러오기 위한 코드
	$.ajax({
		url: "/admin/total." + choice,
		dataType: "json",
		data: { deleted: deleted }
	}).done(function(resp) {

		let record_count_per_page = resp.record_count_per_page;
		let navi_count_per_page = resp.navi_count_per_page;
		let record_total_count = resp.total_data;

		if (record_total_count > 0) {
			// 필요한 Page navigator의 수
			let page_total_count = 0;

			if (record_total_count % record_count_per_page > 0) {
				// 전체 게시글을 한 페이지 당 노출할 게시글 수로 나눴을 때 나머지가 존재한다면 navi 수는 (전체 게시글 / 한 페이지 당 게시글 + 1)
				page_total_count = record_total_count / record_count_per_page + 1;
			} else {
				// 나머지가 존재하지 않는다면 navi 수는 (전체 게시글 / 한 페이지 당 게시글)
				page_total_count = record_total_count / record_count_per_page;
			}

			// 현재 페이지의 Page Navigator들 중 시작 번호
			let start_navi = Math.floor((cpage - 1) / navi_count_per_page) * navi_count_per_page + 1;
			// 현재 페이지의 Page Navigator들 중 끝 번호
			let end_navi = start_navi + navi_count_per_page - 1;

			if (end_navi > page_total_count) {
				end_navi = page_total_count;
			}

			let need_next = end_navi < page_total_count;
			let need_prev = start_navi > 1;

			// 페이지네이션 HTML 생성
			let page_nation = $(".pagination");
			page_nation.empty();

			// '이전 페이지로' 버튼
			let prev_btn = $("<a>", { "class": "page_navi arr_navi start_arr", "href": "javascript:get_community_list(`" + choice + "`, " + (start_navi - 1) + ", '" + deleted + "')" });
			let prev_img = $("<img>", { "class": "navi_icon start_navi", "src": "../image/icon/pagination.png", "alt": "start navi 로고" });
			if (!need_prev) {
				prev_btn.addClass("disabled");
			}
			prev_btn.append(prev_img);
			page_nation.append(prev_btn);


			// 페이지 번호
			for (let i = start_navi; i <= end_navi; i++) {
				let page_navi = $("<a>", { "class": "page_navi", "href": "javascript:get_community_list(`" + choice + "`, " + i + ", '" + deleted + "')" });
				page_navi.text(i);
				if (cpage == i) {
					page_navi.addClass("active");
				}
				page_nation.append(page_navi);
			}

			// '다음 페이지로' 버튼
			let next_btn = $("<a>", { "class": "page_navi arr_navi end_arr", "href": "javascript:get_community_list(`" + choice + "`, " + (end_navi + 1) + ", '" + deleted + "')" });
			let next_img = $("<img>", { "class": "navi_icon end_navi", "src": "../image/icon/pagination.png", "alt": "end navi 로고" });
			if (!need_next) {
				next_btn.addClass("disabled");
			}
			next_btn.append(next_img);
			page_nation.append(next_btn);

			$.ajax({
				url: "/admin/list." + choice,
				dataType: "json",
				data: {
					cpage: cpage,
					deleted: deleted
				}
			}).done(function(resp) {

				let index = cpage * 10 - 9;

				for (let i of resp) {
					if (choice == "board" || choice == "notice") {
						// 게시글 목록을 출력할 조회할 경우
						let row = $("<div>", { "class": "table_row" });
						let hidden_input = $("<input>", { "type": "hidden" });
						let a = $("<a>");

						if (choice == "board") {
							// 게시글을 조회한 경우
							hidden_input.val(i.board_seq);
							a.attr("href", "/admin/detail.board?board_seq=" + i.board_seq);
						} else if (choice == "notice") {
							// 공지사항을 조회한 경우
							hidden_input.val(i.notice_seq);
							a.attr("href", "/admin_detail.notice?notice_seq=" + i.notice_seq);
						}

						let col = $("<div>", { "class": "table_col" });
						let span = $("<span>");

						// table_col 첫번째 요소에 index 값 삽입
						span.text(index++);
						col.append(span);
						row.append(col);

						// table_col 두번째 요소에 title 값 삽입
						col = $("<div>", { "class": "table_col title" });
						span = $("<span>");
						span.text(i.title);
						col.append(span);
						row.append(col);

						// table_col 세번째 요소에 nickname 값 삽입
						col = $("<div>", { "class": "table_col" });
						span = $("<span>");
						span.text(i.nickname);
						col.append(span);
						row.append(col);

						// table_col 네번째 요소에 write_date 값 삽입
						col = $("<div>", { "class": "table_col" });
						span = $("<span>");

						if (deleted == "N") {
							span.text(i.write_date);
						} else {
							span.text(i.delete_date)
						}

						col.append(span);
						row.append(col);

						// table_col 다섯번째 요소에 조회수 or 버튼 삽입
						col = $("<div>", { "class": "table_col" });

						if (deleted == "N") {
							span = $("<span>");
							span.text(i.view_count);
							col.append(span);
						} else {
							col.addClass("restore");
							let btn = $("<button>", { "class": "restore_btn restore_board", "type": "button" })
							btn.text("복구");
							col.append(btn);
						}
						row.append(col);
						row.append(hidden_input);
						// 테이블에 데이터 출력
						if (deleted == "N") {
							a.append(row)
							$(".list_table").append(a);
						} else {
							$(".list_table").append(row);
						}
					} else {
						// 댓글 목록을 출력할 조회할 경우
						let a = $("<a>", { "href": "/admin/detail.board?board_seq=" + i.board_seq });

						let row = $("<div>", { "class": "table_row" });
						let col = $("<div>", { "class": "table_col" });
						let span = $("<span>");

						// table_col 첫번째 요소에 board_seq 값 삽입
						span.text(i.board_seq);
						col.append(span);
						row.append(col);

						// table_col 두번째 요소에 reply_seq 값 삽입
						col = $("<div>", { "class": "table_col reply_seq" });
						span = $("<span>");
						span.text(i.reply_seq);
						col.append(span);
						row.append(col);

						// table_col 세번째 요소에 content 값 삽입
						col = $("<div>", { "class": "table_col" });
						span = $("<span>");
						span.text(i.content);
						col.append(span);
						row.append(col);

						// table_col 네번째 요소에 nickname 값 삽입
						col = $("<div>", { "class": "table_col" });
						span = $("<span>");
						span.text(i.nickname);
						col.append(span);
						row.append(col);

						// table_col 다섯번째 요소에 버튼 삽입
						col = $("<div>", { "class": "table_col" });
						col.addClass("restore");
						let btn = $("<button>", { "class": "restore_btn restore_reply", "type": "button" })
						btn.text("복구");
						col.append(btn);
						row.append(col);

						a.append(row);
						$(".list_table").append(a);
					}
				}
			});

		} else {
			// 검색한 결과가 없을 경우
			let row = $("<div>", { "class": "table_row" });
			row.css({
				"font-size": "16px",
				"justify-content": "center",
				"color": "var(--color-white)",
				"padding": "15px"
			});
			row.text("등록된 결과가 존재하지 않습니다");
			$(".list_table").append(row);
		}
	});
}
