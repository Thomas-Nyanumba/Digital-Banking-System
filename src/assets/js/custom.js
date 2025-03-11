document.addEventListener('DOMContentLoaded', function() {
    // Toggle Sidebar
    const toggleBtn = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    // Check if sidebar elements exist before adding events
    if (toggleBtn && sidebar && mainContent) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }

    // Toggle Sidebar Submenu
    const sidebarMenuItems = document.querySelectorAll('.sidebar .has-submenu');

    if (sidebarMenuItems.length > 0) {
        sidebarMenuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();

                const submenu = this.nextElementSibling;
                const chevron = this.querySelector('.submenu-toggle');

                if (submenu) submenu.classList.toggle('active');
                if (chevron) {
                    chevron.classList.toggle('fa-chevron-down');
                    chevron.classList.toggle('fa-chevron-up');
                }
            });
        });
    }

    // Initialize all Bootstrap dropdowns
    const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownElementList.forEach(dropdownToggleEl => {
        new bootstrap.Dropdown(dropdownToggleEl);
    });

    // Handle responsive layout - updated!
    function handleResponsiveLayout() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');

        if (!sidebar || !mainContent) {
            // Sidebar layout elements don't exist, skip the function
            return;
        }

        if (window.innerWidth < 992) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        } else {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        }

        window.previousWidth = window.innerWidth;
    }

    // Initial check and add resize listener
    window.previousWidth = window.innerWidth;
    handleResponsiveLayout();
    window.addEventListener('resize', handleResponsiveLayout);
});
