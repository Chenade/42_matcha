import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './page-navigation.css';

export type PageTitle = 'page1 Title' | 'My Connections' | 'About Me' | 'Chats' | 'Dates';

export const Navbar = ({
	setPageTitle,
}: {
	setPageTitle: (pageTitle: PageTitle) => void;
}) => {
	const location = useLocation();

	useEffect(() => {
		switch (location.pathname) {
			case '/explorer':
				setPageTitle('page1 Title');
				break;
			case '/connections':
				setPageTitle('My Connections');
				break;
			case '/chats':
				setPageTitle('Chats');
				break;
			case '/dates':
				setPageTitle('Dates');
				break;
			case '/me':
				setPageTitle('About Me');
				break;
			default:
				setPageTitle('page1 Title'); // Default to the first page title
				break;
		}
	}, [location.pathname, setPageTitle]);

	const logout = () => {
		localStorage.removeItem('Token');
		localStorage.removeItem('path');
		localStorage.removeItem('forceLogout');
		window.location.href = '/';
	};

	return (
		<div className="l-navbar" id="nav-bar">
			<nav className="nav">
				<div>
					<a href="/" className="nav_logo">
						<i className="bx bx-layer nav_logo-icon"></i>
						<span className="nav_logo-name">Matcha</span>
					</a>

					<NavbarMenuItem
						onClickMenuItem={() => setPageTitle('page1 Title')}
						menuItemLabel="Explorer"
						pagePath="/explorer"
					/>
					<NavbarMenuItem
						onClickMenuItem={() => setPageTitle('My Connections')}
						menuItemLabel="Connections"
						pagePath="/connections"
					/>
					<NavbarMenuItem
						onClickMenuItem={() => setPageTitle('Chats')}
						menuItemLabel="Chats"
						pagePath="/chats"
					/>
					<NavbarMenuItem
						onClickMenuItem={() => setPageTitle('Dates')}
						menuItemLabel="Dates"
						pagePath="/dates"
					/>
					<NavbarMenuItem
						onClickMenuItem={() => setPageTitle('About Me')}
						menuItemLabel="About Me"
						pagePath="/me"
					/>
				</div>
				{/* <a className="nav_link" href="javascript:void(0)" onClick={logout}> */}
				<a className="nav_link" href="/" onClick={logout}>
					<i className="fas fa-sign-out-alt"></i>
					<span className="nav_name">SignOut</span>
				</a>
			</nav>
		</div>
	);
};

const NavbarMenuItem = ({
	menuItemLabel,
	pagePath,
	onClickMenuItem,
}: {
	menuItemLabel: string;
	pagePath: string;
	onClickMenuItem: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
	return (
		<Link
			to={pagePath}
			className="nav_link"
			onClick={(e) => {
				e.stopPropagation(); // Prevent click from bubbling up to header
				onClickMenuItem(e);
			}}
		>
			{menuItemLabel}
		</Link>
	);
};
