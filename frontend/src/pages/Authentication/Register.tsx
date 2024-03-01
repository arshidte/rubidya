import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState, useAppDispatch, useAppSelector } from '../../store';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import Dropdown from '../../components/Dropdown';
import i18next from 'i18next';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconUser from '../../components/Icon/IconUser';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconPhone from '../../components/Icon/IconPhone';
import { count } from 'console';
import { registerUserByReferral } from '../../store/adminSlice';

const countries = [
    { country: 'Afghanistan', code: '93', iso: 'AF' },
    { country: 'Albania', code: '355', iso: 'AL' },
    { country: 'Algeria', code: '213', iso: 'DZ' },
    { country: 'American Samoa', code: '1-684', iso: 'AS' },
    { country: 'Andorra', code: '376', iso: 'AD' },
    { country: 'Angola', code: '244', iso: 'AO' },
    { country: 'Anguilla', code: '1-264', iso: 'AI' },
    { country: 'Antarctica', code: '672', iso: 'AQ' },
    { country: 'Antigua and Barbuda', code: '1-268', iso: 'AG' },
    { country: 'Argentina', code: '54', iso: 'AR' },
    { country: 'Armenia', code: '374', iso: 'AM' },
    { country: 'Aruba', code: '297', iso: 'AW' },
    { country: 'Australia', code: '61', iso: 'AU' },
    { country: 'Austria', code: '43', iso: 'AT' },
    { country: 'Azerbaijan', code: '994', iso: 'AZ' },
    { country: 'Bahamas', code: '1-242', iso: 'BS' },
    { country: 'Bahrain', code: '973', iso: 'BH' },
    { country: 'Bangladesh', code: '880', iso: 'BD' },
    { country: 'Barbados', code: '1-246', iso: 'BB' },
    { country: 'Belarus', code: '375', iso: 'BY' },
    { country: 'Belgium', code: '32', iso: 'BE' },
    { country: 'Belize', code: '501', iso: 'BZ' },
    { country: 'Benin', code: '229', iso: 'BJ' },
    { country: 'Bermuda', code: '1-441', iso: 'BM' },
    { country: 'Bhutan', code: '975', iso: 'BT' },
    { country: 'Bolivia', code: '591', iso: 'BO' },
    { country: 'Bosnia and Herzegovina', code: '387', iso: 'BA' },
    { country: 'Botswana', code: '267', iso: 'BW' },
    { country: 'Brazil', code: '55', iso: 'BR' },
    { country: 'British Indian Ocean Territory', code: '246', iso: 'IO' },
    { country: 'British Virgin Islands', code: '1-284', iso: 'VG' },
    { country: 'Brunei', code: '673', iso: 'BN' },
    { country: 'Bulgaria', code: '359', iso: 'BG' },
    { country: 'Burkina Faso', code: '226', iso: 'BF' },
    { country: 'Burundi', code: '257', iso: 'BI' },
    { country: 'Cambodia', code: '855', iso: 'KH' },
    { country: 'Cameroon', code: '237', iso: 'CM' },
    { country: 'Canada', code: '1', iso: 'CA' },
    { country: 'Cape Verde', code: '238', iso: 'CV' },
    { country: 'Cayman Islands', code: '1-345', iso: 'KY' },
    { country: 'Central African Republic', code: '236', iso: 'CF' },
    { country: 'Chad', code: '235', iso: 'TD' },
    { country: 'Chile', code: '56', iso: 'CL' },
    { country: 'China', code: '86', iso: 'CN' },
    { country: 'Christmas Island', code: '61', iso: 'CX' },
    { country: 'Cocos Islands', code: '61', iso: 'CC' },
    { country: 'Colombia', code: '57', iso: 'CO' },
    { country: 'Comoros', code: '269', iso: 'KM' },
    { country: 'Cook Islands', code: '682', iso: 'CK' },
    { country: 'Costa Rica', code: '506', iso: 'CR' },
    { country: 'Croatia', code: '385', iso: 'HR' },
    { country: 'Cuba', code: '53', iso: 'CU' },
    { country: 'Curacao', code: '599', iso: 'CW' },
    { country: 'Cyprus', code: '357', iso: 'CY' },
    { country: 'Czech Republic', code: '420', iso: 'CZ' },
    { country: 'Democratic Republic of the Congo', code: '243', iso: 'CD' },
    { country: 'Denmark', code: '45', iso: 'DK' },
    { country: 'Djibouti', code: '253', iso: 'DJ' },
    { country: 'Dominica', code: '1-767', iso: 'DM' },
    { country: 'Dominican Republic', code: '1-809, 1-829, 1-849', iso: 'DO' },
    { country: 'East Timor', code: '670', iso: 'TL' },
    { country: 'Ecuador', code: '593', iso: 'EC' },
    { country: 'Egypt', code: '20', iso: 'EG' },
    { country: 'El Salvador', code: '503', iso: 'SV' },
    { country: 'Equatorial Guinea', code: '240', iso: 'GQ' },
    { country: 'Eritrea', code: '291', iso: 'ER' },
    { country: 'Estonia', code: '372', iso: 'EE' },
    { country: 'Ethiopia', code: '251', iso: 'ET' },
    { country: 'Falkland Islands', code: '500', iso: 'FK' },
    { country: 'Faroe Islands', code: '298', iso: 'FO' },
    { country: 'Fiji', code: '679', iso: 'FJ' },
    { country: 'Finland', code: '358', iso: 'FI' },
    { country: 'France', code: '33', iso: 'FR' },
    { country: 'French Polynesia', code: '689', iso: 'PF' },
    { country: 'Gabon', code: '241', iso: 'GA' },
    { country: 'Gambia', code: '220', iso: 'GM' },
    { country: 'Georgia', code: '995', iso: 'GE' },
    { country: 'Germany', code: '49', iso: 'DE' },
    { country: 'Ghana', code: '233', iso: 'GH' },
    { country: 'Gibraltar', code: '350', iso: 'GI' },
    { country: 'Greece', code: '30', iso: 'GR' },
    { country: 'Greenland', code: '299', iso: 'GL' },
    { country: 'Grenada', code: '1-473', iso: 'GD' },
    { country: 'Guam', code: '1-671', iso: 'GU' },
    { country: 'Guatemala', code: '502', iso: 'GT' },
    { country: 'Guernsey', code: '44-1481', iso: 'GG' },
    { country: 'Guinea', code: '224', iso: 'GN' },
    { country: 'Guinea-Bissau', code: '245', iso: 'GW' },
    { country: 'Guyana', code: '592', iso: 'GY' },
    { country: 'Haiti', code: '509', iso: 'HT' },
    { country: 'Honduras', code: '504', iso: 'HN' },
    { country: 'Hong Kong', code: '852', iso: 'HK' },
    { country: 'Hungary', code: '36', iso: 'HU' },
    { country: 'Iceland', code: '354', iso: 'IS' },
    { country: 'India', code: '91', iso: 'IN' },
    { country: 'Indonesia', code: '62', iso: 'ID' },
    { country: 'Iran', code: '98', iso: 'IR' },
    { country: 'Iraq', code: '964', iso: 'IQ' },
    { country: 'Ireland', code: '353', iso: 'IE' },
    { country: 'Isle of Man', code: '44-1624', iso: 'IM' },
    { country: 'Israel', code: '972', iso: 'IL' },
    { country: 'Italy', code: '39', iso: 'IT' },
    { country: 'Ivory Coast', code: '225', iso: 'CI' },
    { country: 'Jamaica', code: '1-876', iso: 'JM' },
    { country: 'Japan', code: '81', iso: 'JP' },
    { country: 'Jersey', code: '44-1534', iso: 'JE' },
    { country: 'Jordan', code: '962', iso: 'JO' },
    { country: 'Kazakhstan', code: '7', iso: 'KZ' },
    { country: 'Kenya', code: '254', iso: 'KE' },
    { country: 'Kiribati', code: '686', iso: 'KI' },
    { country: 'Kosovo', code: '383', iso: 'XK' },
    { country: 'Kuwait', code: '965', iso: 'KW' },
    { country: 'Kyrgyzstan', code: '996', iso: 'KG' },
    { country: 'Laos', code: '856', iso: 'LA' },
    { country: 'Latvia', code: '371', iso: 'LV' },
    { country: 'Lebanon', code: '961', iso: 'LB' },
    { country: 'Lesotho', code: '266', iso: 'LS' },
    { country: 'Liberia', code: '231', iso: 'LR' },
    { country: 'Libya', code: '218', iso: 'LY' },
    { country: 'Liechtenstein', code: '423', iso: 'LI' },
    { country: 'Lithuania', code: '370', iso: 'LT' },
    { country: 'Luxembourg', code: '352', iso: 'LU' },
    { country: 'Macao', code: '853', iso: 'MO' },
    { country: 'Macedonia', code: '389', iso: 'MK' },
    { country: 'Madagascar', code: '261', iso: 'MG' },
    { country: 'Malawi', code: '265', iso: 'MW' },
    { country: 'Malaysia', code: '60', iso: 'MY' },
    { country: 'Maldives', code: '960', iso: 'MV' },
    { country: 'Mali', code: '223', iso: 'ML' },
    { country: 'Malta', code: '356', iso: 'MT' },
    { country: 'Marshall Islands', code: '692', iso: 'MH' },
    { country: 'Mauritania', code: '222', iso: 'MR' },
    { country: 'Mauritius', code: '230', iso: 'MU' },
    { country: 'Mayotte', code: '262', iso: 'YT' },
    { country: 'Mexico', code: '52', iso: 'MX' },
    { country: 'Micronesia', code: '691', iso: 'FM' },
    { country: 'Moldova', code: '373', iso: 'MD' },
    { country: 'Monaco', code: '377', iso: 'MC' },
    { country: 'Mongolia', code: '976', iso: 'MN' },
    { country: 'Montenegro', code: '382', iso: 'ME' },
    { country: 'Montserrat', code: '1-664', iso: 'MS' },
    { country: 'Morocco', code: '212', iso: 'MA' },
    { country: 'Mozambique', code: '258', iso: 'MZ' },
    { country: 'Myanmar', code: '95', iso: 'MM' },
    { country: 'Namibia', code: '264', iso: 'NA' },
    { country: 'Nauru', code: '674', iso: 'NR' },
    { country: 'Nepal', code: '977', iso: 'NP' },
    { country: 'Netherlands', code: '31', iso: 'NL' },
    { country: 'Netherlands Antilles', code: '599', iso: 'AN' },
    { country: 'New Caledonia', code: '687', iso: 'NC' },
    { country: 'New Zealand', code: '64', iso: 'NZ' },
    { country: 'Nicaragua', code: '505', iso: 'NI' },
    { country: 'Niger', code: '227', iso: 'NE' },
    { country: 'Nigeria', code: '234', iso: 'NG' },
    { country: 'Niue', code: '683', iso: 'NU' },
    { country: 'North Korea', code: '850', iso: 'KP' },
    { country: 'Northern Mariana Islands', code: '1-670', iso: 'MP' },
    { country: 'Norway', code: '47', iso: 'NO' },
    { country: 'Oman', code: '968', iso: 'OM' },
    { country: 'Pakistan', code: '92', iso: 'PK' },
    { country: 'Palau', code: '680', iso: 'PW' },
    { country: 'Palestine', code: '970', iso: 'PS' },
    { country: 'Panama', code: '507', iso: 'PA' },
    { country: 'Papua New Guinea', code: '675', iso: 'PG' },
    { country: 'Paraguay', code: '595', iso: 'PY' },
    { country: 'Peru', code: '51', iso: 'PE' },
    { country: 'Philippines', code: '63', iso: 'PH' },
    { country: 'Pitcairn', code: '64', iso: 'PN' },
    { country: 'Poland', code: '48', iso: 'PL' },
    { country: 'Portugal', code: '351', iso: 'PT' },
    { country: 'Puerto Rico', code: '1-787, 1-939', iso: 'PR' },
    { country: 'Qatar', code: '974', iso: 'QA' },
    { country: 'Republic of the Congo', code: '242', iso: 'CG' },
    { country: 'Reunion', code: '262', iso: 'RE' },
    { country: 'Romania', code: '40', iso: 'RO' },
    { country: 'Russia', code: '7', iso: 'RU' },
    { country: 'Rwanda', code: '250', iso: 'RW' },
    { country: 'Saint Barthelemy', code: '590', iso: 'BL' },
    { country: 'Saint Helena', code: '290', iso: 'SH' },
    { country: 'Saint Kitts and Nevis', code: '1-869', iso: 'KN' },
    { country: 'Saint Lucia', code: '1-758', iso: 'LC' },
    { country: 'Saint Martin', code: '590', iso: 'MF' },
    { country: 'Saint Pierre and Miquelon', code: '508', iso: 'PM' },
    { country: 'Saint Vincent and the Grenadines', code: '1-784', iso: 'VC' },
    { country: 'Samoa', code: '685', iso: 'WS' },
    { country: 'San Marino', code: '378', iso: 'SM' },
    { country: 'Sao Tome and Principe', code: '239', iso: 'ST' },
    { country: 'Saudi Arabia', code: '966', iso: 'SA' },
    { country: 'Senegal', code: '221', iso: 'SN' },
    { country: 'Serbia', code: '381', iso: 'RS' },
    { country: 'Seychelles', code: '248', iso: 'SC' },
    { country: 'Sierra Leone', code: '232', iso: 'SL' },
    { country: 'Singapore', code: '65', iso: 'SG' },
    { country: 'Sint Maarten', code: '1-721', iso: 'SX' },
    { country: 'Slovakia', code: '421', iso: 'SK' },
    { country: 'Slovenia', code: '386', iso: 'SI' },
    { country: 'Solomon Islands', code: '677', iso: 'SB' },
    { country: 'Somalia', code: '252', iso: 'SO' },
    { country: 'South Africa', code: '27', iso: 'ZA' },
    { country: 'South Korea', code: '82', iso: 'KR' },
    { country: 'South Sudan', code: '211', iso: 'SS' },
    { country: 'Spain', code: '34', iso: 'ES' },
    { country: 'Sri Lanka', code: '94', iso: 'LK' },
    { country: 'Sudan', code: '249', iso: 'SD' },
    { country: 'Suriname', code: '597', iso: 'SR' },
    { country: 'Svalbard and Jan Mayen', code: '47', iso: 'SJ' },
    { country: 'Swaziland', code: '268', iso: 'SZ' },
    { country: 'Sweden', code: '46', iso: 'SE' },
    { country: 'Switzerland', code: '41', iso: 'CH' },
    { country: 'Syria', code: '963', iso: 'SY' },
    { country: 'Taiwan', code: '886', iso: 'TW' },
    { country: 'Tajikistan', code: '992', iso: 'TJ' },
    { country: 'Tanzania', code: '255', iso: 'TZ' },
    { country: 'Thailand', code: '66', iso: 'TH' },
    { country: 'Togo', code: '228', iso: 'TG' },
    { country: 'Tokelau', code: '690', iso: 'TK' },
    { country: 'Tonga', code: '676', iso: 'TO' },
    { country: 'Trinidad and Tobago', code: '1-868', iso: 'TT' },
    { country: 'Tunisia', code: '216', iso: 'TN' },
    { country: 'Turkey', code: '90', iso: 'TR' },
    { country: 'Turkmenistan', code: '993', iso: 'TM' },
    { country: 'Turks and Caicos Islands', code: '1-649', iso: 'TC' },
    { country: 'Tuvalu', code: '688', iso: 'TV' },
    { country: 'U.S. Virgin Islands', code: '1-340', iso: 'VI' },
    { country: 'Uganda', code: '256', iso: 'UG' },
    { country: 'Ukraine', code: '380', iso: 'UA' },
    { country: 'United Arab Emirates', code: '971', iso: 'AE' },
    { country: 'United Kingdom', code: '44', iso: 'GB' },
    { country: 'United States', code: '1', iso: 'US' },
    { country: 'Uruguay', code: '598', iso: 'UY' },
    { country: 'Uzbekistan', code: '998', iso: 'UZ' },
    { country: 'Vanuatu', code: '678', iso: 'VU' },
    { country: 'Vatican', code: '379', iso: 'VA' },
    { country: 'Venezuela', code: '58', iso: 'VE' },
    { country: 'Vietnam', code: '84', iso: 'VN' },
    { country: 'Wallis and Futuna', code: '681', iso: 'WF' },
    { country: 'Western Sahara', code: '212', iso: 'EH' },
    { country: 'Yemen', code: '967', iso: 'YE' },
    { country: 'Zambia', code: '260', iso: 'ZM' },
    { country: 'Zimbabwe', code: '263', iso: 'ZW' },
];

const Register = () => {

    const { userId } = useParams();

    const dispatch = useAppDispatch();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [reEnterPassword, setReEnterPassword] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    const { data: userData } = useAppSelector((state: any) => state.registerByReferral);

    useEffect(() => {
        dispatch(setPageTitle('Register new member'));
    }, []);

    // Reset user data and error state after successful submission
    useEffect(() => {
        if (userData) {
            setFirstName('');
            setLastName('');
            setEmail('');
            setMobile('');
            setPassword('');
            setReEnterPassword('');

            alert('Registration successful');
        }
    }, [userData]);

    const submitForm = (e: any) => {
        e.preventDefault();
        const data = { userId, firstName, lastName, email, countryCode, mobile, password };
        if (password !== reEnterPassword) {
            alert('Passwords do not match');
            return;
        } else if (!firstName || !lastName || !email || !countryCode || !mobile || !password) {
            alert('Fill all fields');
            return;
        } else {
            dispatch(registerUserByReferral(data));
        }
    };

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10 flex flex-col items-center text-center">
                                <img src="/assets/images/rubidya.png" alt="logo" className="w-44" />
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-2xl">Sign Up</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Provide your details to register</p>
                            </div>
                            <form className="space-y-5 dark:text-white">
                                <div>
                                    <label htmlFor="Name">First Name</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="firstName"
                                            type="text"
                                            placeholder="Enter First Name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            required
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconUser fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Name">Last Name</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="firstName"
                                            type="text"
                                            placeholder="Enter Last Name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            required
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconUser fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Email"
                                            type="email"
                                            placeholder="Enter Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex gap-2">
                                        <div className="w-1/3">
                                            <label htmlFor="countryCode">Country</label>
                                            <div className="relative text-white-dark">
                                                <select className="form-select text-white-dark" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} required>
                                                    <option>Select</option>
                                                    {countries.map((country) => (
                                                        <option key={country.code} value={country.code}>{`${country.country} (${country.code})`}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="w-2/3">
                                            <label htmlFor="mobile">Mobile</label>
                                            <div className="relative text-white-dark">
                                                <input
                                                    id="mobile"
                                                    type="text"
                                                    placeholder="Enter Mobile"
                                                    value={mobile}
                                                    onChange={(e) => setMobile(e.target.value)}
                                                    className="form-input ps-10 placeholder:text-white-dark"
                                                />
                                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                    <IconPhone fill={true} />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="Password">Password</label>
                                        <div onClick={() => setShowPass(!showPass)} className="hover:underline hover:cursor-pointer">
                                            Show Password
                                        </div>
                                    </div>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Password"
                                            type={showPass ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter Password"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Password">Re-Enter Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Password"
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="Re-Enter Password"
                                            value={reEnterPassword}
                                            onChange={(e) => setReEnterPassword(e.target.value)}
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <button type="submit" onClick={submitForm} className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    Sign Up
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
