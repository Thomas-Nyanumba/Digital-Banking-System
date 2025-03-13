document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    let isManuallyToggled = false;

    if (toggleBtn && sidebar && mainContent) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            isManuallyToggled = true;
        });
    }

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

    const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownElementList.forEach(dropdownToggleEl => {
        new bootstrap.Dropdown(dropdownToggleEl);
    });

    function handleResponsiveLayout() {
        if (!sidebar || !mainContent) return;

        if (window.innerWidth < 992) {
            if (!isManuallyToggled) {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('expanded');
            }
        } else {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
            isManuallyToggled = false; // Reset for desktop
        }
    }

    handleResponsiveLayout();
    window.addEventListener('resize', handleResponsiveLayout);
});
