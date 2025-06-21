document.addEventListener('DOMContentLoaded', function () {
    // --- RESPONSIVE NAVIGATION ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuButton.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // --- IMAGE CAROUSEL ---
    const carousel = document.getElementById('image-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = document.getElementById('carousel-next');
        const prevButton = document.getElementById('carousel-prev');
        const dotsNav = document.getElementById('carousel-dots');
        let slideWidth = slides.length > 0 ? carousel.getBoundingClientRect().width : 0;
        let currentIndex = 0;
        let autoPlayInterval;

        const moveToSlide = (targetIndex) => {
            if (slides.length === 0) return;
            track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
            updateDots();
        };
        
        const updateDots = () => {
            if (dots.length === 0) return;
            dots.forEach((dot, index) => {
                dot.classList.toggle('bg-white', index === currentIndex);
            });
        };
        
        const setSlidePositions = () => {
            if (slides.length === 0) return;
            slideWidth = carousel.getBoundingClientRect().width;
            slides.forEach((slide, index) => {
                slide.style.width = slideWidth + 'px';
            });
            moveToSlide(currentIndex);
        };

        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.classList.add('w-3', 'h-3', 'rounded-full', 'bg-white/50', 'hover:bg-white', 'transition');
            dot.addEventListener('click', () => {
                moveToSlide(index);
                resetAutoPlay();
            });
            dotsNav.appendChild(dot);
        });
        const dots = Array.from(dotsNav.children);

        nextButton.addEventListener('click', () => {
            if (slides.length === 0) return;
            const nextIndex = (currentIndex + 1) % slides.length;
            moveToSlide(nextIndex);
            resetAutoPlay();
        });

        prevButton.addEventListener('click', () => {
            if (slides.length === 0) return;
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(prevIndex);
            resetAutoPlay();
        });
        
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(() => {
                if (slides.length === 0) return;
                const nextIndex = (currentIndex + 1) % slides.length;
                moveToSlide(nextIndex);
            }, 5000); // Change slide every 5 seconds
        };
        
        const resetAutoPlay = () => {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        };

        window.addEventListener('resize', setSlidePositions);
        
        // Initial setup
        setSlidePositions();
        updateDots();
        startAutoPlay();
    }

    // --- DYNAMIC COPYRIGHT YEAR ---
    const copyrightYearEl = document.getElementById('copyright-year');
    if (copyrightYearEl) {
        copyrightYearEl.textContent = new Date().getFullYear();
    }

    // --- GEMINI AI ESTIMATOR ---
    const estimateButton = document.getElementById('estimate-button');
    const projectDescription = document.getElementById('project-description');
    const estimatorResult = document.getElementById('estimator-result');
    const loadingIndicator = document.getElementById('loading-indicator');
    const resultContent = document.getElementById('result-content');

    estimateButton.addEventListener('click', async () => {
        const description = projectDescription.value.trim();
        if (!description) {
            alert('Vui lòng nhập mô tả dự án của bạn.');
            return;
        }

        // Show loading state
        estimatorResult.style.display = 'block';
        loadingIndicator.style.display = 'flex';
        resultContent.innerHTML = '';
        estimateButton.disabled = true;
        estimateButton.classList.add('opacity-50', 'cursor-not-allowed');

        const prompt = `Bạn là một chuyên gia tư vấn vật liệu xây dựng cho công ty sắt thép Nhật Thắng tại Vũng Tàu, Việt Nam. Nhiệm vụ của bạn là giúp khách hàng ước tính vật tư cần thiết cho dự án của họ dựa trên mô tả.

    Danh mục sản phẩm của chúng tôi bao gồm: Thép Tấm, Thép Hình (I, U, V, H), Thép Ống, Thép Hộp, Thép Láp, Inox, Lưới, và các loại Phụ Kiện.

    Dựa trên mô tả dự án sau đây từ khách hàng, hãy phân tích và đưa ra danh sách các vật liệu gợi ý.
    Mô tả dự án: "${description}"

    Vui lòng trả lời bằng tiếng Việt. Trình bày kết quả dưới dạng danh sách rõ ràng, có gạch đầu dòng hoặc đánh số. Với mỗi mục, hãy nêu rõ sản phẩm gợi ý, lý do ngắn gọn và số lượng ước tính. Nếu yêu cầu không rõ ràng, hãy hỏi thêm chi tiết để có thể tư vấn chính xác hơn. Luôn giữ thái độ thân thiện, hữu ích và chuyên nghiệp. Kết thúc câu trả lời bằng một lưu ý rằng đây chỉ là ước tính sơ bộ và khách hàng nên liên hệ trực tiếp để có báo giá chính xác.`;
        
        try {
            const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const apiKey = ""; // API key is not needed for gemini-2.0-flash
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error("API Error:", response.status, errorData);
                throw new Error(`API error! status: ${response.status}`);
            }

            const result = await response.json();
            
            let text = 'Đã có lỗi xảy ra, vui lòng thử lại.';
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                text = result.candidates[0].content.parts[0].text;
            }
            
            // Display result in a <pre> tag to preserve formatting safely
            const pre = document.createElement('pre');
            pre.textContent = text;
            resultContent.appendChild(pre);

        } catch (error) {
            console.error('Error calling Gemini API:', error);
            resultContent.innerHTML = '<p class="text-red-500">Đã có lỗi xảy ra khi kết nối với trợ lý AI. Vui lòng thử lại sau.</p>';
        } finally {
            // Hide loading state
            loadingIndicator.style.display = 'none';
            estimateButton.disabled = false;
            estimateButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    });

    // Mobile product dropdown
    const mobileProductMenuBtn = document.getElementById('mobile-product-menu-btn');
    const mobileProductDropdown = document.getElementById('mobile-product-dropdown');
    if (mobileProductMenuBtn && mobileProductDropdown) {
        mobileProductMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            mobileProductDropdown.classList.toggle('hidden');
        });
    }

    // Slider logic cho từng slider sản phẩm
    function setupSlider(sliderClass, dotClass) {
        const slider = document.querySelector('.' + sliderClass);
        const dots = document.querySelectorAll('.' + dotClass);
        if (!slider || dots.length === 0) return;
        let idx = 0;
        const total = slider.children.length;
        function showSlide(i) {
            slider.style.transform = `translateX(-${i * 100}%)`;
            dots.forEach((d, j) => d.classList.toggle('bg-custom-blue', j === i));
        }
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                idx = i;
                showSlide(idx);
            });
        });
        showSlide(idx);
        setInterval(() => {
            idx = (idx + 1) % total;
            showSlide(idx);
        }, 3500);
    }

    // Danh sách các slider và dot class cần setup
    [
        // thep-tam.html
        ['theptamtron-slider', 'theptamtron-dot'],
        ['theptamkem-slider', 'theptamkem-dot'],
        ['theptamgan-slider', 'theptamgan-dot'],
        // thep-hinh.html
        ['thephinhh-slider', 'thephinhh-dot'],
        ['thephinhi-slider', 'thephinhi-dot'],
        ['thephinhv-slider', 'thephinhv-dot'],
        ['thephinhu-slider', 'thephinhu-dot'],
        // thep-hop.html
        ['thephopvuong-slider', 'thephopvuong-dot'],
        ['thephopcn-slider', 'thephopcn-dot'],
        ['thephopvuongkem-slider', 'thephopvuongkem-dot'],
        ['thephopcnkem-slider', 'thephopcnkem-dot'],
        // thep-ong.html
        ['thepong-slider', 'thepong-dot'],
        ['thephanh-slider', 'thephanh-dot'],
        ['ongkemduc-slider', 'ongkemduc-dot'],
        ['ongkemhan-slider', 'ongkemhan-dot'],
        // thep-dac.html
        ['theptrondac-slider', 'theptrondac-dot'],
        ['thepvuongdac-slider', 'thepvuongdac-dot'],
        ['theptronxaydung-slider', 'theptronxaydung-dot'],
        // luoi.html
        ['luoib40-slider', 'luoib40-dot'],
        ['luoimatcao-slider', 'luoimatcao-dot'],
        ['luoigrating-slider', 'luoigrating-dot'],
        ['luoiovuong-slider', 'luoiovuong-dot'],
        // phu-kien.html
        ['co-slider', 'co-dot'],
        ['te-slider', 'te-dot'],
        ['bau-giam-slider', 'bau-giam-dot'],
        ['chenhan-slider', 'chenhan-dot'],
        ['matbich-slider', 'matbich-dot'],
        ['mangsong-slider', 'mangsong-dot'],
        ['vanthuyluc-slider', 'vanthuyluc-dot'],
        ['roongapluc-slider', 'roongapluc-dot'],
        ['khoaluoigrating-slider', 'khoaluoigrating-dot'],
        ['mangtruot-slider', 'mangtruot-dot'],
        ['banhxecualua-slider', 'banhxecualua-dot'],
        ['chotcua-slider', 'chotcua-dot'],
        ['banlecua-slider', 'banlecua-dot'],
    ].forEach(([slider, dot]) => setupSlider(slider, dot));
});
